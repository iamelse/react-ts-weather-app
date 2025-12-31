import Modal from "./Modal";
import { useSettings } from "../../context/SettingsContext";
import type { TempUnit } from "../../context/SettingsContext";

export interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgGradient: {
    from: string;
    to: string;
  };
}

export default function SettingModal({
  isOpen,
  onClose,
  bgGradient,
}: SettingModalProps) {
  const { unit, setUnit } = useSettings();

  return (
    <Modal isOpen={isOpen} onClose={onClose} bgGradient={bgGradient}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Settings
        </h2>

        <div className="flex items-center justify-between gap-4">
          <label className="text-white/80">
            Temperature Unit
          </label>

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as TempUnit)}
            className="bg-white/20 text-white px-3 py-2 rounded-lg
                       border border-white/20 outline-none"
          >
            <option value="celsius" className="bg-slate-800 text-white">
              °C (Celsius)
            </option>
            <option value="fahrenheit" className="bg-slate-800 text-white">
              °F (Fahrenheit)
            </option>
          </select>
        </div>
      </div>
    </Modal>
  );
}