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
// import { useAuth } from "../context/AuthContext"; // 이 줄은 제거하거나 주석 처리합니다.

// Redux 관련 훅과 타입 임포트
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store"; // src/store/index.ts에서 RootState, AppDispatch 타입 임포트
import { logout } from "../store/authSlice"; // authSlice에서 logout 액션 임포트
import { User } from "../types"; // authSlice에서 User 타입 임포트 (만약 User 인터페이스가 authSlice.ts에 정의되어 있다면)

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
  // AuthContext.tsx 대신 Redux Store에서 user 정보를 가져옵니다.
  const user: User | null = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout()); // Redux logout 액션 dispatch
    onClose(); // 드롭다운 닫기
  };

  if (!user) {
    // user 정보가 없으면 (로그아웃 상태) 드롭다운을 렌더링하지 않거나 다른 처리를 할 수 있습니다.
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
        {/* user.avatarUrl이 있을 경우 사용 */}
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
        {" "}
        {/* Redux logout 함수 호출 */}
        <FaSignOutAlt className="icon" />
        Sign out of Netflix
      </div>
    </div>
  );
};

export default ProfileDropdown;
