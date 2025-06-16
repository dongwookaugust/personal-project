import type { ReactNode } from "react";
import Navbar from "./Navbar";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="layout-container">
    <header className="site-header">
      <Navbar />
    </header>

    <main className="content-area" style={{ position: "relative" }}>
      {children}
      <div id="hover-layer" style={{ position: "relative", zIndex: 10000 }} />
    </main>
  </div>
);

export default Layout;
