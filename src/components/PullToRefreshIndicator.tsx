import { ChevronDown, Loader2 } from "lucide-react";
import type { PTRState } from "../hooks/usePullToRefresh";

interface Props {
  state: PTRState;
  pullDistance: number;
}

const THRESHOLD = 60;

export default function PullToRefreshIndicator({
  state,
  pullDistance,
}: Props) {
  const height = state === "idle" ? 0 : state === "refreshing" ? THRESHOLD : pullDistance;
  const showContent = state !== "idle";

  const progress = state === "pulling" ? Math.min(pullDistance / THRESHOLD, 1) : 1;
  const rotation = state === "refreshing" ? 0 : 180 * progress;
  const opacity = state === "pulling" ? Math.min(pullDistance / 30, 1) : 1;

  return (
    <div
      className="w-full flex flex-col items-center justify-center overflow-hidden transition-[height] duration-200 ease-out"
      style={{ height, flexShrink: 0 }}
    >
      {showContent && (
        <div
          className="flex flex-col items-center gap-1"
          style={{ opacity }}
        >
          {state === "refreshing" ? (
            <Loader2 className="w-5 h-5 text-white/80 animate-spin" strokeWidth={2} />
          ) : (
            <ChevronDown
              className="w-5 h-5 text-white/80 transition-transform duration-200"
              strokeWidth={2}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          )}
          <span className="text-xs text-white/60 font-medium">
            {state === "refreshing" ? "Refreshing..." : "Pull to refresh"}
          </span>
        </div>
      )}
    </div>
  );
}
