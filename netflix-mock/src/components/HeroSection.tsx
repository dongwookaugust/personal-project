import React from "react";
import "./HeroSection.css";

const HeroSection: React.FC = () => (
  <section className="hero-section">
    <div className="hero-overlay">
      <h1 className="hero-title">Welcome to Netflix Mock</h1>
      <p className="hero-description">
        Stream unlimited movies, TV shows, and more. Watch anywhere. Cancel
        anytime.
      </p>
      <button className="hero-button">Get Started</button>
    </div>
  </section>
);

export default HeroSection;
