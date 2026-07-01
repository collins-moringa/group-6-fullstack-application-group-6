import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/gho";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    login(username.trim(), password)
      .then(({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("is_admin", String(user.is_admin));
        localStorage.setItem("username", user.username);
        navigate("/admin");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <main className="main-content">
      <header className="page-header">
        <h1>Admin Login</h1>
      </header>

      <div className="filter-card" style={{ maxWidth: "360px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="filter-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="filter-select"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="filter-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="filter-select"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: "13px" }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{ background: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", padding: "0.6rem 1.25rem", border: "none", borderRadius: "var(--radius)", cursor: "pointer" }}
          >
            {submitting ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;
