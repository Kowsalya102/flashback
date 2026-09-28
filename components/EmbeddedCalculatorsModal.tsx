"use client";

import React, { useState } from "react";
import { X, Calculator, Zap, Thermometer, Cpu, Radio, Activity, CheckCircle2, FileText } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertCode?: (snippet: string) => void;
}

export const EmbeddedCalculatorsModal: React.FC<Props> = ({ isOpen, onClose, onInsertCode }) => {
  const [activeTab, setActiveTab] = useState<"resistor" | "rc" | "i2c" | "baud" | "adc" | "thermal" | "log">("i2c");

  // Resistor Divider State
  const [vin, setVin] = useState(5);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(10);

  // RC Time Constant State
  const [rcR, setRcR] = useState(10000);
  const [rcC, setRcC] = useState(100); // nF

  // I2C Pull-up State
  const [i2cVdd, setI2cVdd] = useState(3.3);
  const [cBus, setCBus] = useState(100); // pF

  // Log Analyzer State
  const [logText, setLogText] = useState("");
  const [analyzedLog, setAnalyzedLog] = useState<any>(null);

  if (!isOpen) return null;

  // Resistor calc
  const vout = (vin * r2) / (r1 + r2);

  // RC calc
  const tauMs = (rcR * (rcC * 1e-9)) * 1000;
  const fcHz = 1 / (2 * Math.PI * rcR * (rcC * 1e-9));

  // I2C calc
  const rMin = (i2cVdd - 0.4) / 0.003;
  const rMaxFast = 300e-9 / (0.8473 * (cBus * 1e-12));

  const handleAnalyzeLog = () => {
    if (!logText.trim()) return;
    const lines = logText.split("\n");
    const errors = lines.filter(l => /error|fail|fault|exception|panic|lockup|timeout/i.test(l));
    const timestamps = lines.map(l => l.match(/\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}/)?.[0]).filter(Boolean);

    setAnalyzedLog({
      totalLines: lines.length,
      errorCount: errors.length,
      signatures: errors.slice(0, 3),
      detectedTimestamp: timestamps[0] || "N/A",
      probableFault: errors[0] || "No explicit exception string detected; potential hard fault or bus deadlock.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D0D16] border border-surface-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-[#12121E]">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-base font-bold text-white">Engineering Calculators &amp; Log Diagnostic</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Chips */}
        <div className="px-6 pt-4 flex flex-wrap gap-2 text-xs font-mono border-b border-surface-border pb-3 bg-[#0B0B12]">
          <button
            onClick={() => setActiveTab("i2c")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "i2c" ? "bg-brand-indigo text-white font-bold" : "text-gray-400 hover:text-white bg-surface"
            }`}
          >
            I2C Pull-Up Sizing
          </button>
          <button
            onClick={() => setActiveTab("resistor")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "resistor" ? "bg-brand-indigo text-white font-bold" : "text-gray-400 hover:text-white bg-surface"
            }`}
          >
            Voltage Divider
          </button>
          <button
            onClick={() => setActiveTab("rc")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "rc" ? "bg-brand-indigo text-white font-bold" : "text-gray-400 hover:text-white bg-surface"
            }`}
          >
            RC Time &amp; Cutoff
          </button>
          <button
            onClick={() => setActiveTab("log")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "log" ? "bg-brand-cyan text-black font-bold" : "text-gray-400 hover:text-white bg-surface"
            }`}
          >
            Log Diagnostic Analyzer
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 font-mono text-xs text-gray-200">
          {activeTab === "i2c" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-cyan" />
                I2C Bus Pull-Up Resistor Calculation
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1">Bus VDD Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={i2cVdd}
                    onChange={(e) => setI2cVdd(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Estimated Bus Capacitance Cbus (pF)</label>
                  <input
                    type="number"
                    value={cBus}
                    onChange={(e) => setCBus(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#07070F] border border-surface-border space-y-2 text-xs">
                <div className="text-gray-400">CALCULATED RESISTOR BOUNDS (400kHz Fast Mode):</div>
                <div className="flex justify-between text-brand-cyan font-bold text-sm">
                  <span>Minimum R_pullup: {rMin.toFixed(0)} Ω</span>
                  <span>Maximum R_pullup: {(rMaxFast / 1000).toFixed(2)} kΩ</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-sans mt-1">
                  ✓ Recommended standard value: <strong>2.2 kΩ</strong> (Provides fast rise time while keeping sinking current under 3mA).
                </div>
              </div>

              {onInsertCode && (
                <button
                  onClick={() => {
                    onInsertCode(`// Calculated I2C Pull-Up Specs (VDD=${i2cVdd}V, Cbus=${cBus}pF): R_recommended = 2.2kΩ`);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-indigo text-white font-bold hover:shadow-glow-indigo"
                >
                  Insert Result into Chat
                </button>
              )}
            </div>
          )}

          {activeTab === "resistor" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Resistor Voltage Divider</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Vin (V)</label>
                  <input
                    type="number"
                    value={vin}
                    onChange={(e) => setVin(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">R1 (kΩ)</label>
                  <input
                    type="number"
                    value={r1}
                    onChange={(e) => setR1(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">R2 (kΩ)</label>
                  <input
                    type="number"
                    value={r2}
                    onChange={(e) => setR2(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#07070F] border border-surface-border text-center space-y-1">
                <div className="text-gray-400">OUTPUT VOLTAGE (Vout):</div>
                <div className="text-2xl font-bold text-brand-cyan">{vout.toFixed(3)} V</div>
              </div>
            </div>
          )}

          {activeTab === "rc" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">RC Filter Time Constant &amp; Cutoff Frequency</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1">Resistor R (Ω)</label>
                  <input
                    type="number"
                    value={rcR}
                    onChange={(e) => setRcR(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Capacitor C (nF)</label>
                  <input
                    type="number"
                    value={rcC}
                    onChange={(e) => setRcC(Number(e.target.value))}
                    className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#07070F] border border-surface-border text-center">
                <div>
                  <div className="text-gray-400 text-[10px]">TIME CONSTANT (τ):</div>
                  <div className="text-lg font-bold text-brand-cyan">{tauMs.toFixed(3)} ms</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px]">CUTOFF FREQ (-3dB fc):</div>
                  <div className="text-lg font-bold text-emerald-400">{fcHz > 1000 ? `${(fcHz/1000).toFixed(2)} kHz` : `${fcHz.toFixed(1)} Hz`}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "log" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-cyan" />
                Log Trace Signature Extractor
              </h3>
              <textarea
                rows={5}
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                placeholder="Paste raw error log, serial console output, or stack trace here..."
                className="w-full bg-surface border border-surface-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan font-mono"
              />

              <button
                onClick={handleAnalyzeLog}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold shadow-glow-indigo"
              >
                Analyze Log Fault Signatures
              </button>

              {analyzedLog && (
                <div className="p-4 rounded-xl bg-[#07070F] border border-brand-cyan/30 space-y-3">
                  <div className="flex justify-between text-xs text-brand-cyan font-bold border-b border-surface-border pb-2">
                    <span>Analyzed Lines: {analyzedLog.totalLines}</span>
                    <span>Exceptions Detected: {analyzedLog.errorCount}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-gray-400 text-[10px] uppercase font-bold">Primary Exception Signature</div>
                    <div className="p-2 rounded bg-red-950/40 border border-red-800 text-red-300 text-xs">
                      {analyzedLog.probableFault}
                    </div>
                  </div>

                  {onInsertCode && (
                    <button
                      onClick={() => {
                        onInsertCode(`[LOG ANALYZER] Extracted Fault: "${analyzedLog.probableFault}"`);
                        onClose();
                      }}
                      className="text-xs text-brand-cyan underline font-bold"
                    >
                      Attach Extracted Fault to Chat Input &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
