import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/trends", label: "Trends", icon: "📈" },
  { to: "/compare", label: "Compare", icon: "⇄" },
  { to: "/favorites", label: "Favorites", icon: "★" },
  { to: "/admin", label: "Admin", icon: "⚙" },
];

function Navbar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo" aria-hidden="true" />
        <span className="sidebar-title">Global Health Observatory</span>
      </div>
      <ul className="sidebar-links">
        {LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
              title={label}
            >
              <span className="sidebar-icon" aria-hidden="true">{icon}</span>
              <span className="sidebar-label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
