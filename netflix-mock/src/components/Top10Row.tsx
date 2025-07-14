import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import HoverCardPortal from "./HoverCardPortal";
import type { ContentItem } from "../types";
import { useHoverCard } from "../hooks/useHoverCard";
import "./Top10Row.css";

import rank1 from "../assets/top10-rank/1.png";
import rank2 from "../assets/top10-rank/2.png";
import rank3 from "../assets/top10-rank/3.png";
import rank4 from "../assets/top10-rank/4.png";
import rank5 from "../assets/top10-rank/5.png";
import rank6 from "../assets/top10-rank/6.png";
import rank7 from "../assets/top10-rank/7.png";
import rank8 from "../assets/top10-rank/8.png";
import rank9 from "../assets/top10-rank/9.png";
import rank10 from "../assets/top10-rank/10.png";

const rankImages = [
  rank1,
  rank2,
  rank3,
  rank4,
  rank5,
  rank6,
  rank7,
  rank8,
  rank9,
  rank10,
];

const VISIBLE_COUNT = 6;

const getHoverCardWidth = () => {
  if (typeof window === "undefined") return 560;
  const dynamicWidth = window.innerWidth * 0.3;
  const minWidth = 180;
  const maxWidth = 560;
  return Math.max(minWidth, Math.min(dynamicWidth, maxWidth));
};

interface Top10RowProps {
  title: string;
  items: ContentItem[];
}

const Top10Row: React.FC<Top10RowProps> = ({ title, items }) => {
  const top10Items = items.slice(0, 10);
  const [pageIndex, setPageIndex] = useState(0);
  const { hoveredInfo, show, hide, clear } = useHoverCard();

  const presets = [
    {
      visible: [0, 1, 2, 3, 4, 5],
      bookendLeft: null,
      bookendRight: 6,
      padLeft: true,
      padRight: false,
    },
    {
      visible: [4, 5, 6, 7, 8, 9],
      bookendLeft: 3,
      bookendRight: null,
      padLeft: false,
      padRight: true,
    },
    {
      visible: [0, 1, 2, 3, 4, 5],
      bookendLeft: 9,
      bookendRight: 6,
      padLeft: false,
      padRight: false,
    },
  ];

  const next = () => {
    if (pageIndex === 0) {
      setPageIndex(1);
    } else if (pageIndex === 1) {
      setPageIndex(2);
    } else {
      setPageIndex(1);
    }
  };
  const prev = () => {
    if (pageIndex === 0) {
      setPageIndex(2);
    } else if (pageIndex === 1) {
      setPageIndex(2);
    } else {
      setPageIndex(1);
    }
  };

  const { visible, bookendLeft, bookendRight, padLeft, padRight } =
    presets[pageIndex];

  const handleHover = (
    e: React.MouseEvent<HTMLDivElement>,
    item: ContentItem,
    idx: number
  ) => {
    clear();
    const cardRect = e.currentTarget.getBoundingClientRect();
    const hoverCardWidth = getHoverCardWidth();
    let offsetX = cardRect.left + cardRect.width / 2 - hoverCardWidth / 2;
    if (idx === 0) {
      offsetX = cardRect.left + 30;
    }
    if (idx === VISIBLE_COUNT - 1) {
      offsetX = cardRect.right - hoverCardWidth;
    }
    if (offsetX < 10) {
      offsetX = 10;
    }
    if (offsetX + hoverCardWidth > window.innerWidth - 10) {
      offsetX = window.innerWidth - hoverCardWidth - 10;
    }
    const parentRect = document
      .getElementById("hover-layer")
      ?.getBoundingClientRect();
    const offsetY = cardRect.top - (parentRect?.top ?? 0) - 30;

    show(
      { item, position: { x: offsetX, y: offsetY }, width: hoverCardWidth },
      500
    );
  };

  return (
    <div className="top10-background">
      <div className="top10-row">
        <h2 className="top10-title">{title}</h2>
        <div
          className="top10-wrapper"
          onMouseLeave={() => {
            hide();
          }}
        >
          {pageIndex !== 0 && (
            <div className="top10-nav left" onClick={prev}>
              <FiChevronLeft />
            </div>
          )}
          <div className="top10-nav right" onClick={next}>
            <FiChevronRight />
          </div>

          <div className="top10-cards static">
            <div className="top10-track">
              {bookendLeft !== null && (
                <div className="top10-card bookend-left partial">
                  <div className="top10-rank-img">
                    <img
                      src={rankImages[bookendLeft]}
                      alt={`rank-${bookendLeft + 1}`}
                    />
                  </div>
                  <div className="top10-thumbnail">
                    <img
                      src={top10Items[bookendLeft].imageUrl}
                      alt="bookend-left"
                    />
                  </div>
                </div>
              )}

              {pageIndex === 0 && padLeft && (
                <div className="top10-card partial" />
              )}

              {visible.map((i, idx) => (
                <div
                  className="top10-card"
                  key={top10Items[i].id}
                  onMouseEnter={(e) => handleHover(e, top10Items[i], idx)}
                  onMouseLeave={() => {
                    hide();
                  }}
                >
                  <div className="top10-rank-img">
                    <img src={rankImages[i]} alt={`rank-${i + 1}`} />
                  </div>
                  <div className="top10-thumbnail">
                    <img
                      src={top10Items[i].imageUrl}
                      alt={top10Items[i].title}
                    />
                  </div>
                </div>
              ))}

              {padRight && <div className="top10-card partial" />}

              {bookendRight !== null && (
                <div className="top10-card bookend-right partial">
                  <div className="top10-rank-img">
                    <img
                      src={rankImages[bookendRight]}
                      alt={`rank-${bookendRight + 1}`}
                    />
                  </div>
                  <div className="top10-thumbnail">
                    <img
                      src={top10Items[bookendRight].imageUrl}
                      alt="bookend-right"
                    />
                  </div>
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
          width={hoveredInfo.width}
          onLeave={hide}
          onEnter={clear}
        />
      )}
    </div>
  );
};

export default Top10Row;
