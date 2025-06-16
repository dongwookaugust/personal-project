import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSearch = () => setShowSearch((prev) => !prev);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll); // cleanup function - runs when your component unmount/unload
  }, []);

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
        <div className={`search-box${showSearch ? " expanded" : ""}`}>
          <FaSearch className="icon search-icon" onClick={toggleSearch} />
          <input
            type="text"
            placeholder="Title, Cast, Genre "
            className="search-input"
          />
        </div>

        <div className="notification-container">
          <FaBell className="icon bell" />
        </div>

        <div className="profile-toggle" onClick={toggleMenu}>
          <FaUserCircle className="avatar-icon" />
          <span className={`triangle ${showMenu ? "up" : "down"}`} />
        </div>

        {showMenu && <ProfileDropdown onClose={() => setShowMenu(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;
