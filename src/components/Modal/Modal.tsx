import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgGradient: {
    from: string;
    to: string;
  };
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  bgGradient,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}DD, ${bgGradient.to}DD)`, // Gradien untuk background
      }}
    >
      <div
        className="relative w-full max-w-md p-2 bg-white/10 rounded-2xl border border-white/30 shadow-lg"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
}