const LINKS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "trends", label: "Trends" },
  { key: "compare", label: "Compare" },
];

function Navbar({ view, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-title">Global Health Observatory</span>
      </div>
      <ul className="navbar-links">
        {LINKS.map(({ key, label }) => (
          <li key={key}>
            <button
              className={`nav-link${view === key ? " active" : ""}`}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
