export interface FirmwareIncident {
  id: string;
  title: string;
  mcu: string;
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
  {
    id: "INC-2024-101",
    title: "STM32F4 I2C1 Bus Lockup on SDA Line Low after Master Reset",
    mcu: "STM32F407VG",
    tags: ["I2C", "HAL", "GPIO", "Bus Lockup"],
    date: "2024-09-12",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "Critical",
    symptom: "I2C1 hangs indefinitely inside HAL_I2C_Master_Transmit() returning HAL_BUSY. Bus sniffer reveals SDA stuck LOW while SCL is HIGH.",
    rootCause: "Slave sensor was interrupted mid-byte transmission during MCU soft reset. Slave holds SDA low waiting for remaining 4 clock pulses.",
    fixDetails: "Implemented GPIO manual bus recovery sequence in main init before enabling I2C IP: configure SCL as GPIO output, toggle SCL 9 times to free slave shift register, send STOP condition.",
    codeSnippet: `void I2C1_Bus_Clear(void) {
  // Switch SCL & SDA to GPIO Output Open-Drain
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
assert(((uintptr_t)tx_buf % 4) == 0); // 32-bit alignment check`
  },
  {
    id: "INC-2024-103",
    title: "nRF52840 UART Framing Errors under Heavy BLE SoftDevice Interrupt Loads",
    mcu: "nRF52840",
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
  {
    id: "INC-2024-104",
    title: "STM32H7 Brown-Out Reset Loop during Flash Write Cycles at 3.3V",
    mcu: "STM32H743ZI",
    tags: ["BOR", "Power", "Flash", "PWR", "Voltage Regulator"],
    date: "2024-09-02",
    author: "Siddharth Nair (Hardware & Embedded Lead)",
    impact: "Critical",
    symptom: "Device resets unexpectedly with BOR flag set in RCC_RSR when writing config sectors to internal Flash memory.",
    rootCause: "Flash erase/program draws sudden current spike causing 3.3V rail dip to 2.6V. Default BOR level was set too high (BOR Level 3 = 2.8V).",
    fixDetails: "Configured PWR_BOR_LEVEL_1 (2.1V threshold) in option bytes and added a 47uF low-ESR tantalum capacitor near MCU VDD pins.",
    codeSnippet: `FLASH_OBProgramInitTypeDef OBInit;
HAL_FLASH_OB_Unlock();
OBInit.OptionType = OPTIONBYTE_BOR;
OBInit.BORLevel = OB_BOR_LEVEL1; // Set BOR threshold to 2.1V
HAL_FLASHEx_OBProgram(&OBInit);
HAL_FLASH_OB_Launch();`
  },
  {
    id: "INC-2024-105",
    title: "ESP32 Task Watchdog (TWDT) Timeout during Flash Partition Encryption",
    mcu: "ESP32",
    tags: ["Watchdog", "TWDT", "FreeRTOS", "Security"],
    date: "2024-06-20",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "High",
    symptom: "Core 0 Task Watchdog triggers reboot during initial flash encryption phase on production boot.",
    rootCause: "Flash encryption routine runs blocking RSA hardware operation on Core 0 without yielding to IDLE task for over 5 seconds.",
    fixDetails: "Called esp_task_wdt_reset() inside the encryption loop chunk, or temporarily fed TWDT during hardware cryptographic initialization.",
    codeSnippet: `for (size_t offset = 0; offset < length; offset += CHUNK_SIZE) {
  esp_flash_write_encrypted(dest + offset, src + offset, CHUNK_SIZE);
  esp_task_wdt_reset(); // Feed TWDT loop
}`
  },
  {
    id: "INC-2024-106",
    title: "BME280 Sensor Driver Race Condition in FreeRTOS Multi-Task SPI Read",
    mcu: "STM32F407VG",
    tags: ["FreeRTOS", "Mutex", "SPI", "Sensor Driver"],
    date: "2024-08-05",
    author: "David Kim (Systems Integration Lead)",
    impact: "Medium",
    symptom: "Pressure and temperature readings return invalid 0xFFFFF data intermittently every few hours.",
    rootCause: "Telemetry Task and Environmental Task accessed SPI1 bus concurrently without mutex protection, causing CS pin signal collision.",
    fixDetails: "Wrapped all SPI HAL calls in xSemaphoreTake(xSPIMutex, portMAX_DELAY) and guaranteed release in hardware finally block.",
    codeSnippet: `if (xSemaphoreTake(xSPIMutex, pdMS_TO_TICKS(100)) == pdTRUE) {
  HAL_GPIO_WritePin(CS_GPIO_Port, CS_Pin, GPIO_PIN_RESET);
  HAL_SPI_TransmitReceive(&hspi1, tx, rx, len, 50);
  HAL_GPIO_WritePin(CS_GPIO_Port, CS_Pin, GPIO_PIN_SET);
  xSemaphoreGive(xSPIMutex);
}`
  },
  {
    id: "INC-2024-107",
    title: "nRF52 PPI + SAADC Battery Voltage Measurement Noise Spike",
    mcu: "nRF52832",
    tags: ["SAADC", "PPI", "ADC", "Power Management"],
    date: "2024-09-18",
    author: "Liam O'Connor (Lead Wireless Firmware Engineer)",
    impact: "Medium",
    symptom: "Battery telemetry spikes by +400mV whenever radio Tx fires concurrently with ADC sample event.",
    rootCause: "SAADC acquisition time was set to 3us (too short) with high internal source impedance (400k voltage divider).",
    fixDetails: "Increased SAADC gain sampling time to 40us (NRF_SAADC_ACQTIME_40US) and added a 10nF filtering capacitor across ADC input.",
    codeSnippet: `nrf_saadc_channel_config_t channel_config =
  NRF_DRV_SAADC_DEFAULT_CHANNEL_CONFIG_SE(NRF_SAADC_INPUT_AIN0);
channel_config.acq_time = NRF_SAADC_ACQTIME_40US; // Allow high-impedance charging`
  },
  {
    id: "INC-2024-108",
    title: "RP2040 Dual Core Inter-core FIFO Deadlock in PIO Quadrature Encoder",
    mcu: "RP2040",
    tags: ["RP2040", "Pico", "SMC", "FIFO", "PIO"],
    date: "2024-05-11",
    author: "Marcus Brody (Principal Firmware Architect)",
    impact: "High",
    symptom: "Core 1 hangs on multicore_fifo_pop_blocking() during high RPM motor acceleration.",
    rootCause: "Core 0 flooded FIFO without checking overflow status while Core 1 was delayed inside an interrupt routine.",
    fixDetails: "Replaced blocking FIFO calls with lockless ring-buffer in shared SRAM backed by spinlock_t primitives.",
    codeSnippet: `uint32_t save = spin_lock_blocking(encoder_lock);
ringbuf_push(&encoder_queue, value);
spin_unlock(encoder_lock, save);`
  },
  {
    id: "INC-2024-109",
    title: "STM32G4 HRTIM PWM Phase Shift Drift in Interleaved Buck Converter",
    mcu: "STM32G474RE",
    tags: ["HRTIM", "PWM", "Power Electronics", "Clocks"],
    date: "2024-07-22",
    author: "Siddharth Nair (Hardware & Embedded Lead)",
    impact: "Critical",
    symptom: "Channel B PWM pulse slips relative to Channel A by up to 15 degrees after 30 minutes of thermal warmup.",
    rootCause: "DLL calibration auto-refresh was disabled, causing HRTIM DLL clock timing to drift as silicon temperature rose.",
    fixDetails: "Enabled HRTIM DLL calibration periodical update mode (HRTIM_DLLCR_CALRTE) in initialization sequence.",
    codeSnippet: `HHrtim.Instance->DLLCR |= HRTIM_DLLCR_CALEN | HRTIM_DLLCR_CALRTE_0; // 10.5ms calibration cycle`
  },
  {
    id: "INC-2024-110",
    title: "ESP32-C3 Wi-Fi Coexistence BLE Beacon Latency Degradation",
    mcu: "ESP32-C3",
    tags: ["BLE", "Wi-Fi", "Coexistence", "Coex"],
    date: "2024-08-18",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "Medium",
    symptom: "BLE advertisement packets drop by 60% when Wi-Fi station connects to 2.4GHz AP.",
    rootCause: "Coexistence balance ratio defaulted to Wi-Fi priority, starving BLE RF time slots during TCP ACK bursts.",
    fixDetails: "Configured esp_coex_preference_set(ESP_COEX_PREFER_BALANCE) and extended BLE advertising interval to 100ms.",
    codeSnippet: `esp_coex_preference_set(ESP_COEX_PREFER_BALANCE);`
  },
  {
    id: "INC-2024-111",
    title: "STM32F7 USB OTG HS DMA Buffer Alignment HardFault",
    mcu: "STM32F767ZI",
    tags: ["USB", "OTG", "HardFault", "Cache", "MPU"],
    date: "2024-09-09",
    author: "David Kim (Systems Integration Lead)",
    impact: "Critical",
    symptom: "HardFault exception when sending USB CDC ACM bulk packets larger than 512 bytes with Cortex-M7 D-Cache enabled.",
    rootCause: "USB DMA controller reads dirty cache lines when MPU memory region is configured as Write-Back instead of Write-Through.",
    fixDetails: "Configured USB RAM buffer MPU region as Device or Non-cacheable (MPU_TEX_LEVEL0, Bufferable=0, Cacheable=0).",
    codeSnippet: `MPU_InitStruct.Enable = MPU_REGION_ENABLE;
MPU_InitStruct.Number = MPU_REGION_NUMBER0;
MPU_InitStruct.BaseAddress = (uint32_t)&USB_TxBuffer;
MPU_InitStruct.Size = MPU_REGION_SIZE_16KB;
MPU_InitStruct.TypeExtField = MPU_TEX_LEVEL0;
MPU_InitStruct.IsCacheable = MPU_ACCESS_NOT_CACHEABLE;
HAL_MPU_ConfigRegion(&MPU_InitStruct);`
  },
  {
    id: "INC-2024-112",
    title: "ESP32 Deep Sleep RTC Memory Corruption on Waking from ULP Coprocessor",
    mcu: "ESP32",
    tags: ["Deep Sleep", "RTC Memory", "ULP", "Power"],
    date: "2024-06-14",
    author: "Marcus Brody (Principal Firmware Architect)",
    impact: "High",
    symptom: "RTC fast memory variables reset to 0 upon wake up from deep sleep mode.",
    rootCause: "RTC RAM power domain was toggled off during sleep because RTC_PERIPH domain wasn't locked.",
    fixDetails: "Added RTC_DATA_ATTR to variable declaration and invoked esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON).",
    codeSnippet: `RTC_DATA_ATTR static uint32_t persistent_boot_count = 0;
esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);`
  },
  {
    id: "INC-2024-113",
    title: "nRF52840 TWIM1 (I2C) Master Clock Stretching Hang during Sensor Read",
    mcu: "nRF52840",
    tags: ["TWIM", "I2C", "Clock Stretching", "Nordic"],
    date: "2024-05-30",
    author: "Liam O'Connor (Lead Wireless Firmware Engineer)",
    impact: "High",
    symptom: "I2C read operation hangs permanently if slave holds SCL low for > 500 microseconds.",
    rootCause: "Nordic Errata 219: TWIM hardware module can enter unrecoverable state if clock stretching coincides with LASTTX event.",
    fixDetails: "Applied Nordic Errata 219 workarounds in SDK and lowered TWIM clock rate from 400kHz to 100kHz for long wire harnesses.",
    codeSnippet: `// Apply Errata 219 Workaround
*(volatile uint32_t *)0x40003500 = 0;
*(volatile uint32_t *)0x40003504 = 1;`
  },
  {
    id: "INC-2024-114",
    title: "STM32L4 RTC Alarm Interrupt Fails to Wake Core from STOP2 Mode",
    mcu: "STM32L476RG",
    tags: ["RTC", "Low Power", "STOP2", "EXTI"],
    date: "2024-08-11",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "Critical",
    symptom: "MCU enters STOP2 low-power mode but never wakes up despite RTC alarm triggering.",
    rootCause: "RTC Alarm EXTI Line 18 event mask bit (EXTI_EMR1) was not set, only interrupt mask (EXTI_IMR1) was enabled.",
    fixDetails: "Explicitly called __HAL_RTC_ALARM_EXTI_ENABLE_EVENT() in addition to interrupt enable.",
    codeSnippet: `__HAL_RTC_ALARM_EXTI_ENABLE_IT();
__HAL_RTC_ALARM_EXTI_ENABLE_EVENT(); // Required for STOP2 wake`
  },
  {
    id: "INC-2024-115",
    title: "STM32F4 CAN Bus Controller Transmit Mailbox Exhaustion under Heavy Load",
    mcu: "STM32F405OE",
    tags: ["CAN", "bxCAN", "Mailbox", "Automotive"],
    date: "2024-04-28",
    author: "David Kim (Systems Integration Lead)",
    impact: "High",
    symptom: "CAN transmit queue returns HAL_CAN_ERROR_PARAM when broadcasting motor telemetry at 1kHz.",
    rootCause: "All 3 bxCAN Tx mailboxes became occupied because CAN bus arbitration was lost due to missing 120-ohm bus termination resistor.",
    fixDetails: "Added physical 120-ohm termination resistor across CAN_H and CAN_L, and implemented software FIFO TX queue fallback.",
    codeSnippet: `if (HAL_CAN_GetTxMailboxesFreeLevel(&hcan1) > 0) {
  HAL_CAN_AddTxMessage(&hcan1, &TxHeader, TxData, &TxMailbox);
} else {
  ringbuffer_enqueue(&can_tx_queue, &TxHeader, TxData);
}`
  },
  {
    id: "INC-2024-116",
    title: "ESP32-S3 USB-JTAG Circuit Reset Loop when Unplugging Debug Cable",
    mcu: "ESP32-S3",
    tags: ["JTAG", "USB", "Reset", "Hardware"],
    date: "2024-07-04",
    author: "Marcus Brody (Principal Firmware Architect)",
    impact: "Medium",
    symptom: "Disconnecting USB cable from PC causes ESP32-S3 to brown out and continuously reboot.",
    rootCause: "VBUS sensing pin floating pulled GPIO pin to indeterminate voltage level triggering chip reset pin line.",
    fixDetails: "Added 10k pulldown resistor to USB VBUS sense pin and configured software GPIO pull in efuse.",
    codeSnippet: `gpio_set_pull_mode(GPIO_NUM_19, GPIO_PULLDOWN_ONLY);`
  },
  {
    id: "INC-2024-117",
    title: "nRF52840 DFU Bootloader Vector Table Relocation HardFault",
    mcu: "nRF52840",
    tags: ["Bootloader", "DFU", "VTOR", "HardFault"],
    date: "2024-09-21",
    author: "Liam O'Connor (Lead Wireless Firmware Engineer)",
    impact: "Critical",
    symptom: "Jumping from SoftDevice bootloader to main application binary triggers immediate HardFault exception.",
    rootCause: "SCB->VTOR vector table address alignment requirement (must be aligned to next power of 2 size = 0x20000 boundary) was violated.",
    fixDetails: "Updated linker script FLASH origin to 0x00026000 and updated SCB->VTOR register write before main application branch.",
    codeSnippet: `SCB->VTOR = MAIN_APP_START_ADDR; // 0x00026000
__set_MSP(*((volatile uint32_t*)MAIN_APP_START_ADDR));
((void (*)(void))(*((volatile uint32_t*)(MAIN_APP_START_ADDR + 4))))();`
  },
  {
    id: "INC-2024-118",
    title: "STM32H7 Dual-Core Shared RAM Mutex Contention Lockup",
    mcu: "STM32H755ZI",
    tags: ["Dual-Core", "H7", "Cortex-M7", "Cortex-M4", "HSEM"],
    date: "2024-08-30",
    author: "Siddharth Nair (Hardware & Embedded Lead)",
    impact: "Critical",
    symptom: "Core M4 hangs waiting for Hardware Semaphore (HSEM) release from Core M7 after soft reset.",
    rootCause: "Core M7 was reset while holding HSEM lock, leaving semaphore locked in hardware without auto-clearing.",
    fixDetails: "Added HSEM notification interrupt handler on Core M4 and invoked HAL_HSEM_Release(index, process_id) during reset init sequence.",
    codeSnippet: `// Force release HSEM on M4 initialization
if (__HAL_HSEM_IS_SEM_LOCKED(HSEM_ID_0)) {
  HAL_HSEM_Take(HSEM_ID_0, 0);
  HAL_HSEM_Release(HSEM_ID_0, 0);
}`
  },
  {
    id: "INC-2024-119",
    title: "FreeRTOS Stack Overflow in LWIP Network Socket Rx Task",
    mcu: "STM32F407VG",
    tags: ["FreeRTOS", "LWIP", "Stack Overflow", "Ethernet"],
    date: "2024-06-08",
    author: "David Kim (Systems Integration Lead)",
    impact: "High",
    symptom: "System enters vApplicationStackOverflowHook callback when receiving large TCP payload frames.",
    rootCause: "LWIP socket receive buffer allocated on task stack instead of heap, exceeding default 512-word stack allocation.",
    fixDetails: "Increased TCP Rx task stack size from 512 words to 2048 words (configMINIMAL_STACK_SIZE * 4) and enabled stack monitoring.",
    codeSnippet: `xTaskCreate(
  lwip_rx_task, 
  "LWIP_RX", 
  2048, // Up from 512
  NULL, 
  configMAX_PRIORITIES - 2, 
  NULL
);`
  },
  {
    id: "INC-2024-120",
    title: "ESP32-S3 Camera Module DMA Pixel Shift in High Humidity",
    mcu: "ESP32-S3",
    tags: ["Camera", "OV2640", "I2S", "DMA", "PCLK"],
    date: "2024-07-29",
    author: "Elena Vance (Senior Embedded Systems Engineer)",
    impact: "Medium",
    symptom: "OV2640 camera image frames exhibit horizontal line skew and color channel swap.",
    rootCause: "Pixel clock (PCLK) signal integrity degraded over long ribbon cable, causing setup/hold time violation at I2S DMA input pin.",
    fixDetails: "Enabled internal GPIO input delay hysteresis and lowered PCLK frequency from 20MHz to 12MHz in camera config.",
    codeSnippet: `camera_config_t config;
config.xclk_freq_hz = 12000000; // Lower XCLK to maintain timing margin`
  },
  {
    id: "INC-2024-121",
    title: "STM32L4 Quadrature Encoder Interface (TIM QEI) Counting Backwards",
    mcu: "STM32L432KC",
    tags: ["Timer", "QEI", "Encoder", "STM32"],
    date: "2024-05-19",
    author: "Siddharth Nair (Hardware & Embedded Lead)",
    impact: "Medium",
    symptom: "Optical encoder count decrements when shaft turns clockwise.",
    rootCause: "Timer Channel 1 and Channel 2 input polarity inverted in TIM_Encoder_InitTypeDef struct.",
    fixDetails: "Swapped IC1Polarity from TIM_ICPOLARITY_RISING to TIM_ICPOLARITY_FALLING in hardware initialization.",
    codeSnippet: `sConfig.IC1Polarity = TIM_ICPOLARITY_FALLING;
sConfig.IC2Polarity = TIM_ICPOLARITY_RISING;
HAL_TIM_Encoder_Init(&htim2, &sConfig);`
  },
  {
    id: "INC-2024-122",
    title: "nRF52 PPI Channel Leak causing Unintended GPIO Toggling during Sleep",
    mcu: "nRF52832",
    tags: ["PPI", "GPIOTE", "Nordic", "Low Power"],
    date: "2024-08-25",
    author: "Liam O'Connor (Lead Wireless Firmware Engineer)",
    impact: "High",
    symptom: "Current consumption during sleep is 1.2mA instead of expected 2uA.",
    rootCause: "PPI channel connecting TIMER0 to GPIOTE task remained enabled before entering sd_app_evt_wait().",
    fixDetails: "Explicitly disabled PPI channel (nrfx_ppi_channel_disable) before low power state entry.",
    codeSnippet: `nrfx_ppi_channel_disable(ppi_channel);`
  }
];

export function findMatchingIncidents(query: string): FirmwareIncident[] {
  const q = query.toLowerCase();
  
  // Score incidents based on match relevance
  const scored = SEEDED_INCIDENTS.map(incident => {
    let score = 0;
    const fullText = `${incident.title} ${incident.mcu} ${incident.tags.join(" ")} ${incident.symptom} ${incident.rootCause} ${incident.fixDetails}`.toLowerCase();
    
    // Check keyword matches
    const keywords = q.split(/\s+/).filter(k => k.length > 2);
    keywords.forEach(kw => {
      if (fullText.includes(kw)) score += 15;
      if (incident.mcu.toLowerCase().includes(kw)) score += 25;
      if (incident.tags.some(t => t.toLowerCase().includes(kw))) score += 30;
      if (incident.title.toLowerCase().includes(kw)) score += 20;
    });

    // Specific domain triggers
    if (q.includes("i2c") && incident.tags.includes("I2C")) score += 40;
    if (q.includes("spi") && incident.tags.includes("SPI")) score += 40;
    if (q.includes("uart") && incident.tags.includes("UART")) score += 40;
    if (q.includes("stm32") && incident.mcu.includes("STM32")) score += 30;
    if (q.includes("esp32") && incident.mcu.includes("ESP32")) score += 30;
    if (q.includes("nrf") && incident.mcu.includes("nRF")) score += 30;
    if (q.includes("lock") || q.includes("hang") || q.includes("busy")) score += 15;
    if (q.includes("brown") || q.includes("reset") || q.includes("bor")) score += 20;
    if (q.includes("watchdog") || q.includes("wdt")) score += 25;
    if (q.includes("dma") || q.includes("buffer")) score += 20;
    if (q.includes("freertos") || q.includes("task") || q.includes("race")) score += 20;

    return {
      ...incident,
      confidence: Math.min(99, Math.max(68, 75 + score))
    };
  });

  // Sort by calculated confidence/score
  scored.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  
  // Return top 2 matching incidents
  return scored.slice(0, 2);
}
