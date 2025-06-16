import React from "react";
import "./NotificationDropdown.css";
import { Notification } from "../types";

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isLoading,
  isError,
  onMouseEnter,
  onMouseLeave,
}) => {
  // When loading, an error occurs, or there are no notifications
  if (isLoading || isError || notifications.length === 0) {
    return (
      <div
        className="notification-dropdown"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="notification-arrow" />
        <div className="notification-empty">
          {isLoading ? "Loading notifications..." : "No new notifications."}
        </div>
      </div>
    );
  }

  return (
    <div
      className="notification-dropdown"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="notification-arrow" />
      <ul className="notification-list">
        {notifications.map((notif) => (
          <li key={notif.id} className="notification-item">
            <img
              src={notif.image}
              alt={notif.subtitle}
              className="notification-image"
            />
            <div className="notification-details">
              <p className="notification-title">{notif.title}</p>
              <p className="notification-subtitle">{notif.subtitle}</p>
              <p className="notification-time">{notif.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
