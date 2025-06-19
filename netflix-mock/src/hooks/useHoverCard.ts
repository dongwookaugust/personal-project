import { useState, useRef } from "react";
import type { ContentItem } from "../types";

export function useHoverCard() {
  const [hoveredInfo, setHoveredInfo] = useState<{
    item: ContentItem;
    position: { x: number; y: number };
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = (
    info: {
      item: ContentItem;
      position: { x: number; y: number };
    },
    delay?: number
  ) => {
    clear();
    if (delay) {
      timerRef.current = setTimeout(() => {
        setHoveredInfo(info);
      }, delay);
    } else {
      setHoveredInfo(info);
    }
  };

  const hide = (delay = 150) => {
    clear();
    timerRef.current = setTimeout(() => {
      setHoveredInfo(null);
    }, delay);
  };

  return {
    hoveredInfo,
    show,
    hide,
    clear,
  };
}
