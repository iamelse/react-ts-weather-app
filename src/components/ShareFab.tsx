import { Share2 } from "lucide-react";

interface ShareFabProps {
  onShare: () => void;
}

export default function ShareFab({ onShare }: ShareFabProps) {
  return (
    <button
      onClick={onShare}
      className="fixed bottom-6 right-6 z-20 p-3 rounded-full bg-white/15 backdrop-blur-lg border border-white/20 shadow-lg hover:bg-white/25 active:scale-95 transition-all"
      aria-label="Share weather"
    >
      <Share2 className="w-5 h-5 text-white/80" strokeWidth={1.5} />
    </button>
  );
}
