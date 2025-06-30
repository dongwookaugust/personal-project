// src/components/ProfileDropdown.tsx
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

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import { User } from "../types";

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
  const user: User | null = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    onClose();
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className="profile-dropdown"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="dropdown-arrow" />
      <div className="profile-dropdown__arrow" />
      <div className="profile-header">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="dropdown-avatar"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
        ) : (
          <FaUserCircle className="dropdown-avatar" />
        )}
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
      <div className="dropdown-item" onClick={handleSignOut}>
        <FaSignOutAlt className="icon" />
        Sign out of Netflix
      </div>
    </div>
  );
};

export default ProfileDropdown;
