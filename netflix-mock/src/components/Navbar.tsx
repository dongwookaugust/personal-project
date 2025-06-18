import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { useGetContentItemsQuery } from "../store/api/contentApi";
import { ContentItem, Notification } from "../types";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notificationTimeoutRef = useRef<number | null>(null);
  const profileTimeoutRef = useRef<number | null>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useGetContentItemsQuery({
    count: 6,
    category: "random",
  });

  useEffect(() => {
    if (data) {
      const randomCount = Math.floor(Math.random() * 6) + 1;
      const randomItems = data.slice(0, randomCount);
      const generatedNotifications = randomItems.map((item: ContentItem) => {
        const randomMonth = Math.floor(Math.random() * 6) + 1;
        const timeAgo = `${randomMonth} month${randomMonth > 1 ? "s" : ""} ago`;
        return {
          id: item.id,
          image: item.imageUrl,
          title: "New Content",
          subtitle: item.title || "Untitled",
          time: timeAgo,
        };
      });
      setNotifications(generatedNotifications);
    }
  }, [data]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (notificationTimeoutRef.current)
        clearTimeout(notificationTimeoutRef.current);
      if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleNotificationEnter = () => {
    if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    setShowMenu(false);
    if (notificationTimeoutRef.current)
      clearTimeout(notificationTimeoutRef.current);
    setShowNotifications(true);
  };
  const handleNotificationLeave = () => {
    notificationTimeoutRef.current = window.setTimeout(
      () => setShowNotifications(false),
      200
    );
  };
  const handleProfileEnter = () => {
    if (notificationTimeoutRef.current)
      clearTimeout(notificationTimeoutRef.current);
    setShowNotifications(false);
    if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    setShowMenu(true);
  };
  const handleProfileLeave = () => {
    profileTimeoutRef.current = window.setTimeout(
      () => setShowMenu(false),
      200
    );
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Netflix Mock
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tv-shows">TV Shows</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/my-list">My List</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <div
          ref={searchBoxRef}
          className={`search-box${showSearch ? " expanded" : ""}`}
        >
          <FaSearch
            className="icon search-icon"
            onClick={() => setShowSearch(!showSearch)}
          />
          <input
            type="text"
            placeholder="Title, Cast, Genre"
            className="search-input"
          />
        </div>

        <div
          className="notification-container"
          onMouseEnter={handleNotificationEnter}
          onMouseLeave={handleNotificationLeave}
        >
          <FaBell className="icon bell" />
          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              isLoading={isLoading}
              isError={isError}
              onMouseEnter={handleNotificationEnter}
              onMouseLeave={handleNotificationLeave}
            />
          )}
        </div>

        <div
          className="profile-toggle"
          onMouseEnter={handleProfileEnter}
          onMouseLeave={handleProfileLeave}
        >
          <FaUserCircle className="avatar-icon" />
          <span className={`triangle ${showMenu ? "up" : "down"}`} />
        </div>

        {showMenu && (
          <ProfileDropdown
            onClose={() => setShowMenu(false)}
            onMouseEnter={handleProfileEnter}
            onMouseLeave={handleProfileLeave}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
