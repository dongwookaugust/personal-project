import React, { useRef, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import HoverCardPortal from "./HoverCardPortal";
import type { ContentItem } from "../types";
import { useHoverCard } from "../hooks/useHoverCard";
import "./ContentRow.css";

interface ContentRowProps {
  title: string;
  items: ContentItem[];
}

const getHoverCardWidth = () => {
  if (typeof window === "undefined") return 560;
  const dynamicWidth = window.innerWidth * 0.3;
  const minWidth = 280;
  const maxWidth = 560;
  return Math.max(minWidth, Math.min(dynamicWidth, maxWidth));
};

const MULTIPLIER = 3;

const ContentRow: React.FC<ContentRowProps> = ({ title, items }) => {
  const visibleCount = 6;
  const middlePage = Math.floor((items.length * MULTIPLIER) / 2);
  const [page, setPage] = useState(middlePage);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [hovered, setHovered] = useState(false);
  const { hoveredInfo, show, hide, clear } = useHoverCard();
  const trackRef = useRef<HTMLDivElement>(null);
  const rowWrapperRef = useRef<HTMLDivElement>(null);

  const blankItem: ContentItem = {
    id: -1,
    title: "blank",
    imageUrl: "",
    overview: "",
    maturity: "",
    isTop10: false,
    adult: false,
  };

  const infiniteItems = Array.from(
    { length: items.length * MULTIPLIER },
    (_, i) => items[i % items.length]
  );

  useEffect(() => {
    if (page <= visibleCount || page >= items.length * 2) {
      setTimeout(() => setPage(middlePage), 300);
    }
  }, [page, items.length, middlePage, visibleCount]);

  const nextPage = () => {
    setIsFirstRender(false);
    setPage((prev) => prev + visibleCount);
  };

  const prevPage = () => {
    setIsFirstRender(false);
    setPage((prev) => prev - visibleCount);
  };

  const realItems = infiniteItems.slice(page, page + visibleCount + 1);
  const visibleItems = isFirstRender
    ? [blankItem, ...realItems.slice(0, visibleCount)]
    : realItems.slice(0, visibleCount);
  const bookendLeft = !isFirstRender ? infiniteItems[page - 1] : null;
  const bookendRight = realItems[visibleCount];

  const handleHover = (
    e: React.MouseEvent<HTMLDivElement>,
    item: ContentItem,
    idx: number
  ) => {
    clear();
    const cardRect = e.currentTarget.getBoundingClientRect();
    const hoverCardWidth = getHoverCardWidth();
    let offsetX = cardRect.left + cardRect.width / 2 - hoverCardWidth / 2;

    const firstCardIndex = isFirstRender ? 1 : 0;
    const lastCardIndex = visibleItems.length - 1;

    if (idx === firstCardIndex) {
      offsetX = cardRect.left;
    }
    if (idx === lastCardIndex) {
      offsetX = cardRect.right - hoverCardWidth;
    }

    const PADDING = 10;
    if (offsetX < PADDING) {
      offsetX = PADDING;
    }
    if (offsetX + hoverCardWidth > window.innerWidth - PADDING) {
      offsetX = window.innerWidth - hoverCardWidth - PADDING;
    }

    const parentRect = document
      .getElementById("hover-layer")
      ?.getBoundingClientRect();

    const offsetY =
      cardRect.top - (parentRect?.top ?? 0) - cardRect.height * 0.4;

    show({ item, position: { x: offsetX, y: offsetY } }, 500);
  };

  return (
    <div className="content-row-background">
      <div className={`content-row ${isFirstRender ? "first-render" : ""}`}>
        <h2 className="row-title">{title}</h2>
        <div
          className={`row-wrapper ${isFirstRender ? "first-render" : ""}`}
          ref={rowWrapperRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            hide();
          }}
        >
          {hovered && (
            <>
              {!isFirstRender && (
                <div className="row-nav left" onClick={prevPage}>
                  <FiChevronLeft />
                </div>
              )}
              <div className="row-nav right" onClick={nextPage}>
                <FiChevronRight />
              </div>
            </>
          )}

          <div
            className={`row-cards static ${
              isFirstRender ? "first-render" : ""
            }`}
          >
            <div className="row-track" ref={trackRef}>
              {bookendLeft && (
                <div className="card bookend-left partial">
                  <img
                    src={bookendLeft.imageUrl}
                    alt="bookend-left"
                    loading="lazy"
                  />
                </div>
              )}

              {visibleItems.map((item, idx) =>
                item.id === -1 ? (
                  <div key={`blank-${idx}`} className="card blank" />
                ) : (
                  <div
                    key={`${item.id}-${idx}`}
                    className="card"
                    onMouseEnter={(e) => handleHover(e, item, idx)}
                    onMouseLeave={() => hide()}
                  >
                    <img src={item.imageUrl} alt={item.title} loading="lazy" />
                  </div>
                )
              )}

              {bookendRight && (
                <div className="card bookend-right partial">
                  <img
                    src={bookendRight.imageUrl}
                    alt="bookend-right"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {hoveredInfo && (
        <HoverCardPortal
          item={hoveredInfo.item}
          position={hoveredInfo.position}
          onLeave={hide}
          onEnter={clear}
        />
      )}
    </div>
  );
};

export default ContentRow;
