"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Database, CheckCircle2, Cpu, ArrowRight } from "lucide-react";

export const TerminalHero: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [step, setStep] = useState<"typing" | "recalling" | "done">("typing");

  const fullPrompt = "STM32F4 I2C bus locks up returning HAL_BUSY. SDA line stuck low.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullPrompt.length) {
        setTypedText(fullPrompt.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setStep("recalling");
        setTimeout(() => {
          setStep("done");
        }, 1200);
      }
    }, 45);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-surface-border bg-[#0C0C14] shadow-2xl overflow-hidden font-mono text-sm">
      {/* Terminal Bar Header */}
      <div className="bg-[#141420] px-4 py-3 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-gray-400 font-sans flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
            flashback-cli v1.4.2 — hindsight-memory-agent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/30">
            <Database className="w-3 h-3 text-brand-cyan" />
            Hindsight Cloud Connected
          </span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 space-y-4 min-h-[320px] text-gray-200">
        {/* User Command Line */}
        <div className="flex items-start gap-3">
          <span className="text-brand-cyan font-bold select-none">&gt;</span>
          <div className="flex-1">
            <span className="text-gray-400">flashback query </span>
            <span className="text-white font-semibold">"{typedText}"</span>
            {step === "typing" && (
              <span className="inline-block w-2 h-4 bg-brand-cyan ml-1 align-middle animate-cursor" />
            )}
          </div>
        </div>

        {/* Hindsight Recall Status Bar */}
        {(step === "recalling" || step === "done") && (
          <div className="animate-in fade-in duration-300 bg-surface/80 border border-brand-indigo/30 rounded-lg p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-brand-cyan">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 animate-spin text-brand-cyan" />
                Hindsight Memory Engine Vectorizing Query...
              </span>
              <span className="text-[10px] text-gray-400 font-sans">top_k=2 | threshold=0.7</span>
            </div>

            {step === "done" && (
              <div className="pt-2 border-t border-surface-border space-y-1.5 text-gray-300">
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    RECALLED PAST TEAM INCIDENT: INC-2024-101 (Match: 98.4%)
                  </span>
                  <span className="text-gray-400 text-[11px]">Solved by Elena Vance (Senior Firmware Eng)</span>
                </div>
                <div className="text-[11px] text-gray-400 pl-5">
                  MCU: STM32F407VG | Symptom: Slave holds SDA low after soft reset | Fix: Bit-bang 9 SCL pulses
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grounded Code Answer Output */}
        {step === "done" && (
          <div className="animate-in slide-in-from-bottom-2 duration-400 space-y-3 pt-2">
            <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-cyan" />
              Grounded Fix (Team Memory Applied):
            </div>

            <div className="bg-[#050508] border border-surface-border rounded-lg p-4 font-mono text-xs overflow-x-auto text-cyan-100">
              <div className="text-gray-500 mb-2">// Inc-2024-101 Fix: Toggle SCL 9x open-drain before main I2C peripheral init</div>
              <pre className="text-emerald-300">
{`void I2C1_Bus_Clear(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  GPIO_InitStruct.Pin = GPIO_PIN_6 | GPIO_PIN_7; // SCL & SDA
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  for (int i = 0; i < 9; i++) {
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_6, GPIO_PIN_RESET);
    DWT_Delay_us(5);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_6, GPIO_PIN_SET);
    DWT_Delay_us(5);
  }
}`}
              </pre>
            </div>
            <div className="text-xs text-gray-400 flex items-center justify-between pt-1">
              <span>Time saved: <strong className="text-white">3.5 hours</strong> of scope debugging</span>
              <span className="text-brand-cyan text-xs flex items-center gap-1 cursor-pointer hover:underline">
                View Incident Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
