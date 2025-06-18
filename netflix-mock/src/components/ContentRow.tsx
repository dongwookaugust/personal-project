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

const getVisibleCount = () => {
  if (typeof window === "undefined") return 6;
  if (window.innerWidth > 1400) return 6;
  if (window.innerWidth > 1100) return 5;
  if (window.innerWidth > 768) return 4;
  return 3;
};

const getHoverCardWidth = () => {
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return window.innerWidth * 0.9;
  }
  return 560;
};

const MULTIPLIER = 3;

const ContentRow: React.FC<ContentRowProps> = ({ title, items }) => {
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const middlePage = Math.floor((items.length * MULTIPLIER) / 2);
  const [page, setPage] = useState(middlePage);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [hovered, setHovered] = useState(false);
  const { hoveredInfo, show, hide, clear } = useHoverCard();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const parentRect = document
      .getElementById("hover-layer")
      ?.getBoundingClientRect();

    const hoverCardWidth = getHoverCardWidth();
    let offsetX = cardRect.left + cardRect.width / 2 - hoverCardWidth / 2;

    const isFirstInRow = isFirstRender ? idx === 1 : idx === 0;
    const isLastInRow = isFirstRender
      ? idx === visibleCount
      : idx === visibleCount - 1;

    if (isFirstInRow) {
      offsetX = cardRect.left;
    }

    if (isLastInRow) {
      offsetX = cardRect.right - hoverCardWidth;
    }

    if (offsetX < 10) {
      offsetX = 10;
    }
    if (offsetX + hoverCardWidth > window.innerWidth - 10) {
      offsetX = window.innerWidth - hoverCardWidth - 10;
    }

    const offsetY = cardRect.top - (parentRect?.top ?? 0) - 90;
    show({ item, position: { x: offsetX, y: offsetY } });
  };

  return (
    <div className="content-row-background">
      <div className="content-row">
        <h2 className="row-title">{title}</h2>
        <div
          className="row-wrapper"
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

          <div className="row-cards static">
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
                    onMouseLeave={() => hide}
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
