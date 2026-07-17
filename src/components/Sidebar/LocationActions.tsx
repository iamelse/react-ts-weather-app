import { Plus } from "lucide-react";

interface LocationActionsProps {
  onOpenModal: () => void;
}

export default function LocationActions({ onOpenModal }: LocationActionsProps) {
  return (
    <button
      onClick={onOpenModal}
      className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium transition"
    >
      <Plus className="w-4 h-4" strokeWidth={2} />
      Add Location
    </button>
  );
}
