import React from "react";
import {
  FaUserCircle,
  FaPencilAlt,
  FaUserFriends,
  FaUser,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ProfileDropdown.css";
import { useAuth } from "../context/AuthContext";

interface ProfileDropdownProps {
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { user } = useAuth();

  return (
    <div
      className="profile-dropdown"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="dropdown-arrow" />
      <div className="profile-dropdown__arrow" />
      <div className="profile-header">
        <FaUserCircle className="dropdown-avatar" />
        <span className="dropdown-username">{user.name}</span>
      </div>
      <div className="dropdown-item">
        <FaPencilAlt className="icon" />
        Manage Profiles
      </div>
      <div className="dropdown-item">
        <FaUserFriends className="icon" />
        Switch Profiles
      </div>
      <div className="dropdown-item">
        <FaUser className="icon" />
        Account
      </div>
      <div className="dropdown-item">
        <FaQuestionCircle className="icon" />
        Help Center
      </div>
      <div className="dropdown-divider" />
      <div className="dropdown-item" onClick={onClose}>
        <FaSignOutAlt className="icon" />
        Sign out of Netflix
      </div>
    </div>
  );
};

export default ProfileDropdown;
