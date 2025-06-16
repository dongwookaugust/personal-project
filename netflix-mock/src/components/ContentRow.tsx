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

const VISIBLE_COUNT = 6;
const CARD_WIDTH = 388;
const CARD_GAP = 15;
const PARTIAL_CARD_WIDTH = CARD_WIDTH / 5;
const MULTIPLIER = 3;

const ContentRow: React.FC<ContentRowProps> = ({ title, items }) => {
  const middlePage = Math.floor((items.length * MULTIPLIER) / 2);
  const [page, setPage] = useState(middlePage);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [hovered, setHovered] = useState(false);
  const { hoveredInfo, show, hide, clear } = useHoverCard();
  const trackRef = useRef<HTMLDivElement>(null);

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
    if (page <= VISIBLE_COUNT || page >= items.length * 2) {
      setTimeout(() => setPage(middlePage), 300);
    }
  }, [page, items.length, middlePage]);

  const nextPage = () => {
    setIsFirstRender(false);
    setPage((prev) => prev + VISIBLE_COUNT);
  };

  const prevPage = () => {
    setIsFirstRender(false);
    setPage((prev) => prev - VISIBLE_COUNT);
  };

  // [blankItem, ...realItems.slice(0, VISIBLE_COUNT)] - this create a new array, that combines blankitem and realitems from index 0 to 6
  // (parentRect?.top ?? 0)
  const realItems = infiniteItems.slice(page, page + VISIBLE_COUNT + 1);
  const visibleItems = isFirstRender
    ? [blankItem, ...realItems.slice(0, VISIBLE_COUNT)]
    : realItems.slice(0, VISIBLE_COUNT);
  const bookendLeft = !isFirstRender ? infiniteItems[page - 1] : null;
  const bookendRight = realItems[VISIBLE_COUNT];

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

    const hoverCardWidth = 490;
    const hoverCardHeight = 300;
    const verticalPadding = 180;

    let offsetX = cardRect.left + cardRect.width / 2 - hoverCardWidth / 2;

    const isFirst = isFirstRender ? idx === 1 : idx === 0;
    const isLast = isFirstRender
      ? idx === VISIBLE_COUNT
      : idx === VISIBLE_COUNT - 1;

    if (isFirst) offsetX += 90;
    if (isLast) offsetX -= 160;

    const offsetY =
      cardRect.top - (parentRect?.top ?? 0) - hoverCardHeight + verticalPadding;

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
              <div className="row-nav left" onClick={prevPage}>
                <FiChevronLeft />
              </div>
              <div className="row-nav right" onClick={nextPage}>
                <FiChevronRight />
              </div>
            </>
          )}

          <div className="row-cards static">
            <div
              className="row-track"
              ref={trackRef}
              style={{
                gap: `${CARD_GAP}px`,
                marginRight: `-${PARTIAL_CARD_WIDTH}px`,
              }}
            >
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
