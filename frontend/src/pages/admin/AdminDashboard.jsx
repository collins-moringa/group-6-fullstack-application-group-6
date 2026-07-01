import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCountries from "./AdminCountries";
import AdminIndicators from "./AdminIndicators";
import AdminDataPoints from "./AdminDataPoints";
import AdminUsers from "./AdminUsers";

const TABS = [
  { key: "countries", label: "Countries" },
  { key: "indicators", label: "Indicators" },
  { key: "data", label: "Data" },
  { key: "users", label: "Users" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("countries");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("username");
    navigate("/admin/login");
  };

  return (
    <main className="main-content">
      <header className="page-header">
        <h1>Admin</h1>
        <button
          onClick={handleLogout}
          style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "0.5rem 1rem", borderRadius: "var(--radius)", cursor: "pointer", fontSize: "0.875rem" }}
        >
          Log Out
        </button>
      </header>

      <div className="controls" style={{ marginBottom: "1.5rem" }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="select"
            style={{
              cursor: "pointer",
              fontWeight: tab === key ? 700 : 400,
              borderColor: tab === key ? "var(--color-primary)" : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "countries" && <AdminCountries />}
      {tab === "indicators" && <AdminIndicators />}
      {tab === "data" && <AdminDataPoints />}
      {tab === "users" && <AdminUsers />}
    </main>
  );
}

export default AdminDashboard;
