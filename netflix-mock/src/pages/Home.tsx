import React from "react";
import FeaturedSection from "../components/FeaturedSection";
import ContentRow from "../components/ContentRow";
import { useContentItems } from "../hooks/useContentItems";
import Top10Row from "../components/Top10Row";
import "./Home.css";
import netflixLogo from "../assets/netflix-logo.png";

const Home: React.FC = () => {
  const {
    items: featuredItems,
    loading,
    error,
  } = useContentItems(30, "random");

  const { items: similarItems } = useContentItems(30, "similar");
  const { items: continueItems } = useContentItems(30, "continue");
  if (loading)
    return (
      <div className="center-message">
        <img src={netflixLogo} alt="netflix" />
      </div>
    );
  if (error)
    return (
      <div className="center-message">
        An error occurred while fetching data.
      </div>
    );

  const similarTitle = similarItems[0]
    ? `${similarItems[0].title} Similar Content`
    : "Similar Content";

  return (
    <>
      {featuredItems[0] && (
        <FeaturedSection
          item={featuredItems[0]}
          rankText="No. 1 in Today's Series Rankings"
        />
      )}

      <ContentRow title={similarTitle} items={similarItems} />
      <Top10Row
        title="Top 10 Series in South Korea Today"
        items={featuredItems}
      />
      <ContentRow title="Continue Watching for You" items={continueItems} />
    </>
  );
};

export default Home;
