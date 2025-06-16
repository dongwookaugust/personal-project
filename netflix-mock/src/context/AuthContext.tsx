import React, { createContext, useContext, type ReactNode } from "react";

interface User {
  name: string;
  avatarUrl: string;
  notifications: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
}

const defaultAuth: AuthContextType = {
  isAuthenticated: true,
  user: {
    name: "Mock User",
    avatarUrl: "/assets/avatar-placeholder.png",
    notifications: 6,
  },
};
// parent -> child -> grand child - what do you call this process? // props drilling, use context to avoid props drilling. also to pass state to siblings
const AuthContext = createContext<AuthContextType>(defaultAuth);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <AuthContext.Provider value={defaultAuth}>{children}</AuthContext.Provider>
);
