import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import WorkPage from "./pages/WorkPage";
import AddProject from "./pages/AddProject";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        position: "relative",
        padding: "10px 18px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.02em",
        transition: "all 0.25s ease",
        transform: "translateY(0)",

        color: isActive ? "#111" : "rgba(255,255,255,0.7)",
        background: isActive
          ? "linear-gradient(135deg, #ffb35c, #ff8c3a)"
          : "transparent",

        boxShadow: isActive
          ? "0 10px 25px rgba(255,179,92,0.25)"
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.background = "rgba(255,255,255,0.06)";
          e.target.style.color = "white";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.background = "transparent";
          e.target.style.color = "rgba(255,255,255,0.7)";
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
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,15,22,0.75)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: 14,
            opacity: 0.9,
          }}
        >
          ALI
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
  style={{
    display: "flex",
    gap: 6,
    padding: 6,
    borderRadius: 999,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    backdropFilter: "blur(10px)",
  }}
>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/work">Work</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            to="/admin/add-project"
            style={{
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0f16",
          color: "white",
          fontFamily: "Calibri, Arial, sans-serif",
        }}
      >
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