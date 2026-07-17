import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgGradient: { from: string; to: string };
  children: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  bgGradient,
  children,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}99, ${bgGradient.to}99)`,
      }}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[94vw] sm:max-w-md bg-white/10 rounded-2xl border border-white/15 shadow-xl backdrop-blur-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-1.5 rounded-lg hover:bg-white/20 transition z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 text-white/70" strokeWidth={1.5} />
        </button>

        {children}
      </div>
    </div>
  );
}
