import React from "react";
import FeaturedSection from "../components/FeaturedSection";
import ContentRow from "../components/ContentRow";
import Top10Row from "../components/Top10Row";
import { useGetContentItemsQuery } from "../store/api/contentApi";
import "./Home.css";
import netflixLogo from "../assets/netflix-logo.png";

const Home: React.FC = () => {
  const {
    data: featuredItems = [],
    isLoading: loading,
    isError: error,
  } = useGetContentItemsQuery({ count: 30, category: "random" });

  const { data: similarItems = [] } = useGetContentItemsQuery({
    count: 30,
    category: "similar",
  });
  const { data: continueItems = [] } = useGetContentItemsQuery({
    count: 30,
    category: "continue",
  });

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
