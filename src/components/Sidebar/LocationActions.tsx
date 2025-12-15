interface LocationActionsProps {
  onOpenModal: () => void;
}

export default function LocationActions({ onOpenModal }: LocationActionsProps) {
  return (
    <button
      onClick={onOpenModal}
      className="w-full bg-white/20 hover:bg-white/30 text-white rounded-lg py-2 transition"
    >
      Manage Locations
    </button>
  );
}