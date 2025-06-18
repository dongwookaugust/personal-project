// import React, { createContext, useContext, type ReactNode } from "react";

// interface User {
//   name: string;
//   avatarUrl: string;
//   notifications: number;
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User;
// }

// const defaultAuth: AuthContextType = {
//   isAuthenticated: true,
//   user: {
//     name: "Mock User",
//     avatarUrl: "/assets/avatar-placeholder.png",
//     notifications: 6,
//   },
// };

// const AuthContext = createContext<AuthContextType>(defaultAuth);
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => (
//   <AuthContext.Provider value={defaultAuth}>{children}</AuthContext.Provider>
// );
