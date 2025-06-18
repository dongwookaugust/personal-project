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
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return window.innerWidth * 0.9;
  }
  return 560;
};

interface Top10RowProps {
  title: string;
  items: ContentItem[];
}

const Top10Row: React.FC<Top10RowProps> = ({ title, items }) => {
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

  const next = () => setPageIndex((prev) => (prev === 2 ? 1 : prev + 1));
  const prev = () => setPageIndex((prev) => (prev === 0 ? 1 : prev - 1));

  const { visible, bookendLeft, bookendRight, padLeft, padRight } =
    presets[pageIndex];

  return (
    <div className="top10-background">
      <div className="top10-row">
        <h2 className="top10-title">{title}</h2>
        <div className="top10-wrapper" onMouseLeave={() => hide()}>
          <div className="top10-nav left" onClick={prev}>
            <FiChevronLeft />
          </div>
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
                    <img src={items[bookendLeft].imageUrl} alt="bookend-left" />
                  </div>
                </div>
              )}

              {padLeft && <div className="top10-card blank" />}

              {visible.map((i, idx) => (
                <div
                  className="top10-card"
                  key={items[i].id}
                  onMouseEnter={(e) => {
                    clear();
                    const cardRect = e.currentTarget.getBoundingClientRect();
                    const parentRect = document
                      .getElementById("hover-layer")
                      ?.getBoundingClientRect();

                    const hoverCardWidth = getHoverCardWidth();
                    let offsetX =
                      cardRect.left + cardRect.width / 2 - hoverCardWidth / 2;
                    const offsetY = cardRect.top - (parentRect?.top ?? 0) - 30;

                    if (idx === 0) {
                      offsetX = cardRect.left + 30;
                    }
                    if (idx === VISIBLE_COUNT - 1) {
                      offsetX = cardRect.right - hoverCardWidth - 30;
                    }

                    if (offsetX < 10) {
                      offsetX = 10;
                    }
                    if (offsetX + hoverCardWidth > window.innerWidth - 10) {
                      offsetX = window.innerWidth - hoverCardWidth - 10;
                    }

                    show({
                      item: items[i],
                      position: { x: offsetX, y: offsetY },
                    });
                  }}
                  onMouseLeave={() => hide()}
                >
                  <div className="top10-rank-img">
                    <img src={rankImages[i]} alt={`rank-${i + 1}`} />
                  </div>
                  <div className="top10-thumbnail">
                    <img src={items[i].imageUrl} alt={items[i].title} />
                  </div>
                </div>
              ))}

              {padRight && <div className="top10-card blank" />}

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
                      src={items[bookendRight].imageUrl}
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
          onLeave={() => hide()}
          onEnter={clear}
        />
      )}
    </div>
  );
};

export default Top10Row;
