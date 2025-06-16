import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPlus,
  FaThumbsUp,
  FaChevronDown,
  FaVolumeMute,
  FaVolumeUp,
  FaTimes,
} from "react-icons/fa";
import type { ContentItem } from "../types";
import "./HoverCard.css";

interface HoverCardProps {
  item: ContentItem;
  onClose?: () => void;
}

const HoverCard: React.FC<HoverCardProps> = ({ item, onClose }) => {
  const [muted, setMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const episodes = item.episodesDetail ?? [];

  const toggleMute = () => setMuted((prev) => !prev);
  const toggleExpand = () => setIsExpanded(true);
  const closeExpand = () => {
    setIsExpanded(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        closeExpand();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeExpand();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isExpanded]);

  useEffect(() => {
    const modal = document.querySelector(".hover-card-modal");

    const handleWheel = (e: WheelEvent) => {
      const target = e.currentTarget as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const isUp = e.deltaY < 0;
      const isDown = e.deltaY > 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      if ((isUp && isAtTop) || (isDown && isAtBottom)) {
        e.preventDefault();
      }
    };

    if (isExpanded && modal instanceof HTMLElement) {
      document.body.style.overflow = "hidden";
      modal.addEventListener("wheel", handleWheel as EventListener, {
        passive: false,
      });
    }

    return () => {
      document.body.style.overflow = "";
      if (modal instanceof HTMLElement) {
        modal.removeEventListener("wheel", handleWheel as EventListener);
      }
    };
  }, [isExpanded]);

  return (
    <>
      {!isExpanded && (
        <div className="hover-card">
          <div className="hover-card-thumbnail">
            <img src={item.imageUrl} alt={item.title} />
            <button className="mute-btn" onClick={toggleMute}>
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>

          <div className="hover-card-controls">
            <div className="btn-group">
              <button className="btn">
                <FaPlay />
              </button>
              <button className="btn">
                <FaPlus />
              </button>
              <button className="btn">
                <FaThumbsUp />
              </button>
            </div>
            <button className="btn info-btn" onClick={toggleExpand}>
              <FaChevronDown />
            </button>
          </div>

          <div className="hover-card-meta">
            <div className="meta-row">
              <span className="badge age">{item.maturity}</span>
              <span>{item.episodes} Episodes</span>
              {item.hd && <span className="hd-tag">HD</span>}
            </div>
            <div className="meta-tags">
              {item.genres?.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="hover-card-modal">
          <div className="hover-card-expanded" ref={cardRef}>
            <div className="expanded-header">
              <img src={item.imageUrl} alt={item.title} />
              <button className="close-btn" onClick={closeExpand}>
                <FaTimes />
              </button>
            </div>

            <div className="expanded-body">
              <div className="meta-top">
                <span className="badge age">{item.maturity}</span>
                {item.episodes && (
                  <span className="badge episodes">
                    {item.episodes} Episodes
                  </span>
                )}
                {item.hd && <span className="badge hd">HD</span>}
              </div>

              <div className="meta-content">
                <div className="title-row">
                  <h2 className="title">{item.title}</h2>
                </div>

                <p className="description">{item.overview}</p>

                <div className="meta-tags">
                  {item.genres?.map((genre) => (
                    <span key={genre}>{genre}</span>
                  ))}
                </div>
              </div>

              {episodes.length > 0 && (
                <div className="episode-list">
                  {episodes.map((ep, index) => (
                    <div className="episode-item" key={ep.id}>
                      <div className="episode-rank">{index + 1}</div>
                      <div className="episode-thumbnail">
                        <img src={ep.thumbnailUrl} alt={ep.title} />
                        <div className="thumbnail-overlay">
                          <FaPlay className="overlay-play-icon" />
                        </div>
                      </div>
                      <div className="episode-info">
                        <div className="episode-header">
                          <div className="episode-title">{ep.title}</div>
                          <div className="episode-runtime">{ep.runtime}</div>
                        </div>
                        <div className="episode-description">
                          {ep.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HoverCard;
