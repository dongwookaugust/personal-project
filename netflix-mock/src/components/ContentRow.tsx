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
  const rowWrapperRef = useRef<HTMLDivElement>(null); // row-wrapper에 대한 ref 추가

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
    const cardRect = e.currentTarget.getBoundingClientRect();
    const hoverCardWidth = getHoverCardWidth();

    // row-wrapper의 바운딩 사각형 가져오기
    const rowWrapperRect = rowWrapperRef.current?.getBoundingClientRect();
    if (!rowWrapperRect) return; // rowWrapperRef를 사용할 수 없으면 종료

    // row-wrapper의 왼쪽 가장자리에 상대적인 원하는 중앙 위치 계산
    let offsetX =
      cardRect.left +
      cardRect.width / 2 -
      hoverCardWidth / 2 -
      rowWrapperRect.left;

    const totalVisibleCards = visibleCount; // 현재 보이는 "전체" 카드 수

    // 행의 첫 번째 카드에 대한 조정
    if (idx === 0) {
      offsetX = cardRect.left - rowWrapperRect.left;
    }

    // 행의 마지막 카드에 대한 조정
    if (idx === totalVisibleCards - 1) {
      offsetX = cardRect.right - hoverCardWidth - rowWrapperRect.left;
    }

    // row-wrapper에 비해 너무 왼쪽으로 가지 않도록 보장
    if (offsetX < 0) {
      offsetX = 0;
    }
    // row-wrapper에 비해 너무 오른쪽으로 가지 않도록 보장
    if (offsetX + hoverCardWidth > rowWrapperRect.width) {
      offsetX = rowWrapperRect.width - hoverCardWidth;
    }

    // OffsetY 계산은 대부분 동일하게 유지
    const parentRect = document
      .getElementById("hover-layer")
      ?.getBoundingClientRect();
    const offsetY = cardRect.top - (parentRect?.top ?? 0) - 90;

    show({ item, position: { x: offsetX, y: offsetY } }, 500);
  };

  return (
    <div className="content-row-background">
      <div className="content-row">
        <h2 className="row-title">{title}</h2>
        <div
          className="row-wrapper"
          ref={rowWrapperRef} // 여기에 ref 할당
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
