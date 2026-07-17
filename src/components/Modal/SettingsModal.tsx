import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import Modal from "./Modal";
import { useSettings } from "../../hooks/useSettings";
import type { TempUnit } from "../../types/settings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgGradient: { from: string; to: string };
}

const options: { value: TempUnit; label: string }[] = [
  { value: "celsius", label: "°C Celsius" },
  { value: "fahrenheit", label: "°F Fahrenheit" },
];

export default function SettingsModal({
  isOpen,
  onClose,
  bgGradient,
}: SettingsModalProps) {
  const { unit, setUnit } = useSettings();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find((o) => o.value === unit);

  return (
    <Modal isOpen={isOpen} onClose={onClose} bgGradient={bgGradient}>
      <div className="p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-5">
          Settings
        </h2>

        <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
          Temperature Unit
        </label>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition text-white text-sm"
          >
            <span>{selected?.label}</span>
            <ChevronDown
              className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={1.5}
            />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden z-20">
              {options.map((opt) => {
                const active = opt.value === unit;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setUnit(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition
                      ${active ? "text-white bg-white/15" : "text-white/70 hover:bg-white/10 hover:text-white"}
                    `}
                  >
                    <span>{opt.label}</span>
                    {active && <Check className="w-4 h-4" strokeWidth={2} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
