import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import HoverCard from "./HoverCard";
import type { ContentItem } from "../types";

interface HoverCardPortalProps {
  item: ContentItem;
  position: { x: number; y: number };
  onEnter?: () => void;
  onLeave?: () => void;
}

const HoverCardPortal: React.FC<HoverCardPortalProps> = ({
  item,
  position,
  onEnter,
  onLeave,
}) => {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.getElementById("hover-layer");
    if (container) setEl(container);
  }, []);

  if (!el) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{ pointerEvents: "auto" }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <HoverCard item={item} />
      </div>
    </div>,
    el
  );
};

export default HoverCardPortal;
