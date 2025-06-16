import React, { useState } from "react";
import "./FeaturedSection.css";
import { FaPlay, FaInfoCircle, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import type { ContentItem } from "../types";

interface FeaturedSectionProps {
  item: ContentItem;
  rankText: string;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  item,
  rankText,
}) => {
  const [muted, setMuted] = useState(false);
  const toggleMute = () => setMuted((prev) => !prev);

  return (
    <section
      className="featured-section"
      style={{ backgroundImage: `url(${item.imageUrl})` }}
    >
      <div className="featured-overlay">
        <div className="featured-title">{item.title}</div>

        <div className="featured-subline">
          <div className="featured-badge">
            <span className="badge-line1">TOP</span>
            <span className="badge-line2">10</span>
          </div>
          <span className="rank-text">{rankText}</span>
        </div>

        <p className="featured-desc">{item.overview}</p>

        <div className="featured-buttons">
          <button className="btn btn-play">
            <FaPlay /> Play
          </button>
          <button className="btn btn-info">
            <FaInfoCircle /> Detail
          </button>
        </div>
      </div>

      <div className="featured-controls">
        <button className="control-btn" onClick={toggleMute}>
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <span className="maturity">
          <span className={`maturity-badge${item.adult ? " adult" : ""}`}>
            {item.maturity}
          </span>
        </span>
      </div>
    </section>
  );
};

export default FeaturedSection;
