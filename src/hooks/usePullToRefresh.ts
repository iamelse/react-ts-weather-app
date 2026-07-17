import { useState, useRef, useCallback, useEffect } from "react";

export type PTRState = "idle" | "pulling" | "refreshing";

const THRESHOLD = 60;
const MAX_PULL = 80;

export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [state, setState] = useState<PTRState>("idle");
  const [pullDistance, setPullDistance] = useState(0);

  const startY = useRef(0);
  const pulling = useRef(false);
  const pullDistRef = useRef(0);
  const stateRef = useRef(state);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (stateRef.current === "refreshing") return;
    if (window.scrollY > 0) return;

    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || stateRef.current === "refreshing") return;

    const delta = e.touches[0].clientY - startY.current;

    if (delta <= 0) {
      setPullDistance(0);
      setState("idle");
      pulling.current = false;
      return;
    }

    const clamped = Math.min(delta * 0.5, MAX_PULL);
    pullDistRef.current = clamped;

    setState("pulling");
    setPullDistance(clamped);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!pulling.current) return;
    pulling.current = false;

    const dist = pullDistRef.current;

    if (dist >= THRESHOLD && stateRef.current === "pulling") {
      setState("refreshing");
      setPullDistance(THRESHOLD);

      const result = onRefreshRef.current();
      Promise.resolve(result).finally(() => {
        setState("idle");
        setPullDistance(0);
        pullDistRef.current = 0;
      });
    } else {
      setState("idle");
      setPullDistance(0);
      pullDistRef.current = 0;
    }
  }, []);

  return {
    state,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
