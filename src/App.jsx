import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import WorkPage from "./pages/WorkPage";
import AddProject from "./pages/AddProject";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";

function NavLink({ to, children, mobile = false, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: mobile ? "flex-start" : "center",
        width: mobile ? "100%" : "auto",
        position: "relative",
        padding: mobile ? "14px 16px" : "10px 18px",
        borderRadius: mobile ? 16 : 999,
        fontSize: mobile ? 15 : 14,
        fontWeight: 500,
        letterSpacing: "0.02em",
        transition: "all 0.25s ease",
        transform: "translateY(0)",
        boxSizing: "border-box",

        color: isActive ? "#111" : "rgba(255,255,255,0.78)",
        background: isActive
          ? "linear-gradient(135deg, #ffb35c, #ff8c3a)"
          : mobile
          ? "rgba(255,255,255,0.03)"
          : "transparent",

        boxShadow: isActive
          ? "0 10px 25px rgba(255,179,92,0.25)"
          : "none",
        border: mobile && !isActive ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive && !mobile) {
          e.target.style.background = "rgba(255,255,255,0.06)";
          e.target.style.color = "white";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive && !mobile) {
          e.target.style.background = "transparent";
          e.target.style.color = "rgba(255,255,255,0.78)";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
        }
      }}
    >
      {children}
    </Link>
  );
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/work", label: "Work" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .app-shell {
          min-height: 100vh;
          background: #0a0f16;
          color: white;
          font-family: Calibri, Arial, sans-serif;
          overflow-x: hidden;
        }

        .site-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10,15,22,0.78);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .site-navbar-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-width: 0;
        }

        .site-brand {
          color: white;
          font-weight: 700;
          letter-spacing: 0.12em;
          font-size: 14px;
          opacity: 0.92;
          text-decoration: none;
          flex: 0 0 auto;
        }

        .desktop-nav-wrap {
          flex: 1 1 auto;
          display: flex;
          justify-content: center;
          min-width: 0;
        }

        .desktop-nav {
          display: flex;
          gap: 6px;
          padding: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
          backdrop-filter: blur(10px);
          flex-wrap: nowrap;
          max-width: 100%;
        }

        .desktop-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }

        .admin-link {
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .admin-link:hover {
          background: rgba(255,255,255,0.06);
          color: white;
          transform: translateY(-2px);
        }

        .mobile-menu-btn {
          display: none;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: white;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          padding: 0;
          flex: 0 0 auto;
        }

        .mobile-menu-btn span {
          display: block;
          width: 18px;
          height: 2px;
          background: white;
          border-radius: 999px;
          position: relative;
          transition: all 0.25s ease;
        }

        .mobile-menu-btn span::before,
        .mobile-menu-btn span::after {
          content: "";
          position: absolute;
          left: 0;
          width: 18px;
          height: 2px;
          background: white;
          border-radius: 999px;
          transition: all 0.25s ease;
        }

        .mobile-menu-btn span::before {
          top: -6px;
        }

        .mobile-menu-btn span::after {
          top: 6px;
        }

        .mobile-menu-panel {
          display: none;
        }

        @media (max-width: 900px) {
          .desktop-nav-wrap,
          .desktop-right {
            display: none;
          }

          .mobile-menu-btn {
            display: inline-flex;
          }

          .site-navbar-inner {
            padding: 14px 16px;
          }

          .mobile-menu-panel {
            display: block;
            padding: 0 16px 16px;
          }

          .mobile-menu-card {
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(14px);
            border-radius: 22px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.28);
          }

          .mobile-menu-links {
            display: grid;
            gap: 10px;
            padding: 14px;
          }

          .mobile-admin-wrap {
            padding: 0 14px 14px;
          }

          .mobile-admin-link {
            display: inline-flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            padding: 14px 16px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: rgba(255,255,255,0.84);
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03);
          }
        }
      `}</style>

      <div className="site-navbar">
        <div className="site-navbar-inner">
          <Link
            to="/"
            className="site-brand"
            onClick={() => setMobileMenuOpen(false)}
          >
            ALI
          </Link>

          <div className="desktop-nav-wrap">
            <div className="desktop-nav">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="desktop-right">
            <Link to="/admin/add-project" className="admin-link">
              Admin
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu-panel">
            <div className="mobile-menu-card">
              <div className="mobile-menu-links">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    mobile={true}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="mobile-admin-wrap">
                <Link
                  to="/admin/add-project"
                  className="mobile-admin-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/add-project" element={<AddProject />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}