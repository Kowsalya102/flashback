export interface FirmwareIncident {
  id: string;
  title: string;
  mcu: string;
  domain: "Hardware" | "Firmware" | "Software";
  tags: string[];
  date: string;
  author: string;
  symptom: string;
  rootCause: string;
  fixDetails: string;
  codeSnippet?: string;
  confidence?: number;
  impact: "Critical" | "High" | "Medium";
}

export const SEEDED_INCIDENTS: FirmwareIncident[] = [
  // --- ORIGINAL EMBEDDED / FIRMWARE INCIDENTS ---
  {
    id: "INC-2024-101",
    title: "STM32F4 I2C1 Bus Lockup on SDA Line Low after Master Reset",
    mcu: "STM32F407VG",
    domain: "Firmware",
    tags: ["I2C", "HAL", "GPIO", "Bus Lockup"],
    date: "2024-09-12",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "Critical",
    symptom: "I2C1 hangs indefinitely inside HAL_I2C_Master_Transmit() returning HAL_BUSY. Bus sniffer reveals SDA stuck LOW while SCL is HIGH.",
    rootCause: "Slave sensor was interrupted mid-byte transmission during MCU soft reset. Slave holds SDA low waiting for remaining 4 clock pulses.",
    fixDetails: "Implemented GPIO manual bus recovery sequence in main init before enabling I2C IP: configure SCL as GPIO output, toggle SCL 9 times to free slave shift register, send STOP condition.",
    codeSnippet: `void I2C1_Bus_Clear(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  GPIO_InitStruct.Pin = GPIO_PIN_6 | GPIO_PIN_7;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  for (int i = 0; i < 9; i++) {
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_6, GPIO_PIN_RESET);
    DWT_Delay_us(5);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_6, GPIO_PIN_SET);
    DWT_Delay_us(5);
  }
}`
  },
  {
    id: "INC-2024-102",
    title: "ESP32-S3 SPI DMA Corrupting Transmit Buffers above 20MHz Clock",
    mcu: "ESP32-S3",
    domain: "Firmware",
    tags: ["SPI", "DMA", "PSRAM", "Alignment"],
    date: "2024-08-29",
    author: "Marcus Brody (Principal Firmware Architect)",
    impact: "Critical",
    symptom: "SPI LCD display shows random artifacts and corrupted bytes during fast frame transfers when SPI clock exceeds 20MHz.",
    rootCause: "DMA buffer was allocated on stack / DRAM without 32-bit alignment and cache-line cache invalidation when reading from PSRAM.",
    fixDetails: "Allocated SPI TX/RX buffers using heap_caps_malloc(size, MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL) and added cache sync.",
    codeSnippet: `uint8_t *tx_buf = (uint8_t *)heap_caps_malloc(
  FRAME_SIZE, 
  MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL
);
assert(((uintptr_t)tx_buf % 4) == 0);`
  },
  {
    id: "INC-2024-103",
    title: "nRF52840 UART Framing Errors under Heavy BLE SoftDevice Interrupt Loads",
    mcu: "nRF52840",
    domain: "Firmware",
    tags: ["UART", "UARTE", "EasyDMA", "BLE", "SoftDevice"],
    date: "2024-07-15",
    author: "Liam O'Connor (Lead Wireless Firmware Engineer)",
    impact: "High",
    symptom: "High baud rate (115200) UART reception misses bytes and trips ERRORSRC framing errors during BLE connection event bursts.",
    rootCause: "Legacy app_uart driver used CPU interrupts per byte. BLE SoftDevice higher-priority interrupts blocked UART ISR > 86 microseconds.",
    fixDetails: "Migrated UART to hardware UARTE (EasyDMA) with double-ring RX buffers. CPU is only interrupted on DMA buffer boundary.",
    codeSnippet: `nrfx_uarte_config_t config = NRFX_UARTE_DEFAULT_CONFIG;
config.p_rx_buffer = rx_dma_buffer;
config.rx_buffer_size = 256;
nrfx_uarte_init(&uarte_instance, &config, uarte_event_handler);`
  },

  // --- NEW HARDWARE INCIDENTS ---
  {
    id: "INC-2024-201",
    title: "Weak I2C Pull-Up Resistor Causing Rise-Time Violation at 400kHz Fast Mode",
    mcu: "STM32G071 / Board Hardware",
    domain: "Hardware",
    tags: ["I2C", "Pull-up", "Oscilloscope", "Signal Integrity"],
    date: "2024-09-24",
    author: "Siddharth Nair (Hardware & Power Systems Lead)",
    impact: "High",
    symptom: "I2C communication works reliably at 100kHz Standard Mode but fails with NACK errors at 400kHz Fast Mode on PCB Rev C.",
    rootCause: "Board design used 10kΩ pull-up resistors on SDA/SCL. Total bus capacitance of 85pF caused SCL rise-time (tr = 590ns) to exceed the 300ns max specification for 400kHz I2C.",
    fixDetails: "Replaced 10kΩ pull-ups with 2.2kΩ surface-mount resistors, reducing SCL rise time to 130ns and restoring crisp square waves verified via oscilloscope.",
    codeSnippet: `// Calculated minimum pull-up resistor:
// R_min = (VDD - 0.4V) / 3mA = (3.3V - 0.4V) / 3mA = 966 Ω
// R_max = t_r / (0.8473 * C_bus) = 300ns / (0.8473 * 85pF) = 4.18 kΩ
// Selected 2.2 kΩ (Optimal balance for low current and fast rise time)`
  },
  {
    id: "INC-2024-202",
    title: "Switching DC-DC Converter Ripple Noise Injecting 100mV Spikes into Analog ADC",
    mcu: "Custom PCB / Buck Regulator",
    domain: "Hardware",
    tags: ["Power Supply", "ADC Noise", "Buck Regulator", "EMI"],
    date: "2024-09-19",
    author: "Siddharth Nair (Hardware & Power Systems Lead)",
    impact: "Critical",
    symptom: "Precision thermistor ADC values fluctuate by +/- 45 counts when step-down buck regulator operates under heavy load.",
    rootCause: "Analogue reference pin (VDDA / VREF+) shared ground trace with high-current switching loop of TPS62130 buck regulator, creating 1.2MHz switching ripple noise.",
    fixDetails: "Added ferrite bead (BLM18HE152SN1D) and 10uF + 100nF decoupling capacitors adjacent to VDDA pin, and split AGND/DGND at single star point under MCU.",
    codeSnippet: `// Hardware Revision Note:
// 1. Added L1 Ferrite Bead on VDDA power trace.
// 2. Placed C12 (100nF X7R) directly against STM32 Pin 13 (VDDA).
// 3. Isolated AGND copper flood with single 0-ohm jumper link to DGND at power input.`
  },
  {
    id: "INC-2024-203",
    title: "Inductive Motor Back-EMF Spikes Tripping MCU Reset Pin",
    mcu: "RP2040 / Motor Driver Circuit",
    domain: "Hardware",
    tags: ["Motors", "Back-EMF", "Flyback Diode", "Reset Loop"],
    date: "2024-09-05",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "Critical",
    symptom: "MCU soft-resets whenever 24V brushed DC motor abruptly stops or changes direction.",
    rootCause: "Missing flyback freewheeling diodes across inductive motor coils. Negative back-EMF voltage spike (-38V) coupled through PCB ground plane into MCU RUN (reset) pin trace.",
    fixDetails: "Fitted 1N5819 Schottky flyback diodes in parallel across motor terminals and added 100nF ceramic filtering capacitor across MCU RUN pin to GND.",
    codeSnippet: `// Hardware schematic modification:
// +24V Motor ---+--- (M+) --- Schottky (1N5819) A->K --- (M-) --- GND
// RUN_PIN ------- 100nF Filter Cap ------- GND`
  },
  {
    id: "INC-2024-204",
    title: "BLE 2.4GHz PCB Trace Antenna Detuned by Metallic Enclosure Shielding",
    mcu: "nRF52840 / Enclosure",
    domain: "Hardware",
    tags: ["RF", "BLE", "Antenna", "Matching Network", "VNA"],
    date: "2024-08-14",
    author: "Liam O'Connor (Lead Wireless Firmware Engineer)",
    impact: "High",
    symptom: "BLE RSSI drops from -55dBm to -92dBm and drops packets when plastic enclosure top with metallic paint is snapped closed.",
    rootCause: "Conductive metallic paint layer shifted antenna resonant frequency from 2.44GHz down to 2.18GHz due to capacitive loading.",
    fixDetails: "Re-tuned Pi-matching network (C-L-C) using Vector Network Analyzer (VNA) with enclosure fitted: C1=0.8pF, L1=3.9nH, C2=Open.",
    codeSnippet: `// RF Matching Network (Pi Topology):
// nRF52 ANT Pin ---> [ C1: 0.8pF ] ---> [ L1: 3.9nH (Series) ] ---> Antenna
// Shunt C2: DNP (Do Not Populate)
// Measured S11 tuning: -22dB at 2.440GHz with final plastic shell.`
  },
  {
    id: "INC-2024-205",
    title: "Power MOSFET Gate Driver Overheating due to Slow Switching Transients",
    mcu: "High-Power Motor Control PCB",
    domain: "Hardware",
    tags: ["MOSFET", "Thermal", "Gate Driver", "PWM"],
    date: "2024-07-31",
    author: "Siddharth Nair (Hardware & Power Systems Lead)",
    impact: "Critical",
    symptom: "N-channel MOSFETs in H-Bridge motor driver exceed 110°C thermal threshold within 45 seconds of 20kHz PWM operation.",
    rootCause: "Gate resistor value (220Ω) was too high, causing long charging time (tR = 850ns) of MOSFET gate input capacitance (Ciss = 3200pF), keeping FET in linear resistive region during switching.",
    fixDetails: "Reduced gate drive resistor to 10Ω and added push-pull NPN/PNP totem-pole buffer to supply 1.5A peak gate charging current. Temperature dropped to 42°C.",
    codeSnippet: `// MOSFET Gate Drive Circuit:
// MCU PWM Pin ---> Totem-Pole (2N3904 / 2N3906) ---> 10 Ohm Gate Resistor ---> MOSFET Gate
// Switching rise time decreased from 850ns to 35ns.`
  },

  // --- NEW SOFTWARE INCIDENTS ---
  {
    id: "INC-2024-301",
    title: "Python Asyncio Event Loop Deadlock in Telemetry MQTT Worker Thread",
    mcu: "Backend Cloud Gateway",
    domain: "Software",
    tags: ["Python", "Asyncio", "Deadlock", "Threading", "MQTT"],
    date: "2024-09-22",
    author: "Marcus Brody (Principal Firmware Architect)",
    impact: "Critical",
    symptom: "Python IoT gateway service stops processing incoming device telemetry payloads after 2 hours. Process remains alive with 0% CPU utilization.",
    rootCause: "A blocking synchronous HTTP request (`requests.post()`) was invoked inside an `async def` callback, blocking the single-threaded asyncio event loop execution.",
    fixDetails: "Replaced blocking `requests.post()` with non-blocking `httpx.AsyncClient` or wrapped execution in `asyncio.to_thread()`. Added `asyncio.wait_for()` timeout handlers.",
    codeSnippet: `import httpx

# FIX: Use async non-blocking client
async def forward_telemetry(payload: dict):
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.post("https://api.cloud.internal/telemetry", json=payload)
        return response.status_code`
  },
  {
    id: "INC-2024-302",
    title: "C++ Use-After-Free in Asynchronous Network Packet Queue",
    mcu: "Linux Edge Gateway / C++20",
    domain: "Software",
    tags: ["C++", "Memory Corruption", "Smart Pointers", "Use-After-Free"],
    date: "2024-09-17",
    author: "David Kim (Systems Integration Lead)",
    impact: "Critical",
    symptom: "Edge daemon crashes randomly with Segmentation Fault inside `PacketHandler::process()` during high network traffic bursts.",
    rootCause: "Raw pointer to stack-allocated `Packet` object was bound inside a lambda closure passed to worker thread pool (`std::thread`), outliving the caller frame stack.",
    fixDetails: "Migrated packet queue payload management to `std::shared_ptr<Packet>` and enabled AddressSanitizer (`-fsanitize=address`) in CI build pipeline.",
    codeSnippet: `// FIX: Pass shared ownership via std::shared_ptr
void QueuePacket(std::shared_ptr<Packet> pkt) {
  worker_pool.enqueue([pkt]() {
    pkt->process(); // Safe: ownership extended for lifetime of lambda
  });
}`
  },
  {
    id: "INC-2024-303",
    title: "Go Concurrent Map Read/Write Panic in Device Session Manager",
    mcu: "Go Backend / Server",
    domain: "Software",
    tags: ["Go", "Concurrency", "Goroutine", "Mutex", "Race Condition"],
    date: "2024-09-08",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "High",
    symptom: "Go microservice crashes with `fatal error: concurrent map read and map write` when 1000+ IoT clients connect simultaneously.",
    rootCause: "Unsynchronized Go map (`map[string]*ClientSession`) was modified in concurrent goroutines inside connection HTTP handler.",
    fixDetails: "Replaced native map with `sync.RWMutex` read-write lock guard wrapper, or migrated to `sync.Map` for high-concurrency lookup loads.",
    codeSnippet: `type SessionManager struct {
    mu       sync.RWMutex
    sessions map[string]*ClientSession
}

func (sm *SessionManager) Get(id string) (*ClientSession, bool) {
    sm.mu.RLock()
    defer sm.mu.RUnlock()
    s, ok := sm.sessions[id]
    return s, ok
}`
  },
  {
    id: "INC-2024-304",
    title: "Docker Build Cache Invalidation Stalling CI/CD Pipeline Deploys",
    mcu: "CI/CD / Docker",
    domain: "Software",
    tags: ["Docker", "CI/CD", "BuildKit", "Caching", "DevOps"],
    date: "2024-08-27",
    author: "David Kim (Systems Integration Lead)",
    impact: "Medium",
    symptom: "GitHub Actions release builds take 25 minutes instead of 2 minutes because Docker rebuilds every layer from scratch on every commit.",
    rootCause: "A wildcard `COPY . .` instruction was placed before `npm install` / `pip install` in Dockerfile, invalidating dependency cache whenever any source file changed.",
    fixDetails: "Restructured Dockerfile to copy `package.json` / `requirements.txt` first, run package installation, and then copy application source code.",
    codeSnippet: `FROM node:20-alpine
WORKDIR /app
# Copy dependency manifests first for layer caching
COPY package*.json ./
RUN npm ci --only=production
# Copy remaining source code after dependency install
COPY . .
CMD ["npm", "start"]`
  },
  {
    id: "INC-2024-305",
    title: "PostgreSQL N+1 Query Stalling REST API Endpoints under Load",
    mcu: "PostgreSQL / Prisma / Node.js",
    domain: "Software",
    tags: ["Database", "PostgreSQL", "N+1", "SQL", "Performance"],
    date: "2024-08-11",
    author: "Marcus Brody (Principal Firmware Architect)",
    impact: "High",
    symptom: "Device listing API endpoint latency scales linearly up to 8.5 seconds when querying 500 telemetry devices.",
    rootCause: "ORM was executing 1 initial query for devices plus 500 separate SQL queries inside a loop to fetch device metadata (`SELECT * FROM metadata WHERE device_id = x`).",
    fixDetails: "Rewrote query to use SQL `JOIN` or ORM `include` / eager-loading, reducing 501 database roundtrips down to 1 single indexed join query.",
    codeSnippet: `-- FIX: Combined SQL JOIN query
SELECT d.id, d.name, m.firmware_version, m.last_ping 
FROM devices d 
LEFT JOIN device_metadata m ON d.id = m.device_id 
WHERE d.account_id = $1;`
  }
];

export function findMatchingIncidents(query: string, domainFilter?: string): FirmwareIncident[] {
  const q = query.toLowerCase();
  
  let candidates = SEEDED_INCIDENTS;
  if (domainFilter && domainFilter !== "Auto-detect" && domainFilter !== "All") {
    candidates = candidates.filter(inc => inc.domain.toLowerCase() === domainFilter.toLowerCase());
  }

  const scored = candidates.map(incident => {
    let score = 0;
    const fullText = `${incident.title} ${incident.mcu} ${incident.tags.join(" ")} ${incident.symptom} ${incident.rootCause} ${incident.fixDetails}`.toLowerCase();
    
    const keywords = q.split(/\s+/).filter(k => k.length > 2);
    keywords.forEach(kw => {
      if (fullText.includes(kw)) score += 15;
      if (incident.mcu.toLowerCase().includes(kw)) score += 25;
      if (incident.tags.some(t => t.toLowerCase().includes(kw))) score += 30;
      if (incident.title.toLowerCase().includes(kw)) score += 20;
    });

    // Domain keyword matches
    if (q.includes("pull-up") || q.includes("adc") || q.includes("ripple") || q.includes("back-emf") || q.includes("antenna") || q.includes("mosfet")) {
      if (incident.domain === "Hardware") score += 35;
    }
    if (q.includes("python") || q.includes("asyncio") || q.includes("c++") || q.includes("docker") || q.includes("postgres") || q.includes("go") || q.includes("race")) {
      if (incident.domain === "Software") score += 35;
    }
    if (q.includes("i2c") || q.includes("spi") || q.includes("uart") || q.includes("dma") || q.includes("rtos") || q.includes("hal")) {
      if (incident.domain === "Firmware") score += 35;
    }

    return {
      ...incident,
      confidence: Math.min(99, Math.max(68, 75 + score))
    };
  });

  scored.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  return scored.slice(0, 2);
}
