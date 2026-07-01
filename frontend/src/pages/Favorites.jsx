import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites, getCountries, addFavorite, deleteFavorite } from "../services/gho";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState(null);

  const loadFavorites = () => {
    setLoading(true);
    setError(null);
    Promise.all([getFavorites(), getCountries()])
      .then(([favData, countryData]) => {
        setFavorites(favData);
        setCountries(countryData);
        if (countryData.length > 0 && !selectedCountryId) {
          setSelectedCountryId(String(countryData[0].id));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedCountryId) return;

    addFavorite({ country_id: Number(selectedCountryId), notes: notes.trim() || undefined })
      .then((fav) => {
        setFavorites([...favorites, fav]);
        setNotes("");
      })
      .catch((err) => setFormError(err.response?.data?.message || "Failed to save favorite"));
  };

  const handleDelete = (id) => {
    deleteFavorite(id)
      .then(() => setFavorites(favorites.filter((f) => f.id !== id)))
      .catch(() => setFormError("Failed to delete favorite"));
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="main-content">
      <header className="page-header">
        <h1>Favorite Countries</h1>
      </header>

      <div className="filter-card" style={{ marginBottom: "1.5rem" }}>
        <label className="filter-label">Add a favorite</label>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.5rem" }}>
          <select
            className="filter-select"
            value={selectedCountryId}
            onChange={(e) => setSelectedCountryId(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.Title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Optional note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="select"
          />
          <button
            type="submit"
            style={{ background: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", padding: "0.6rem 1.25rem", border: "none", borderRadius: "var(--radius)", cursor: "pointer" }}
          >
            Save Favorite
          </button>
        </form>
        {formError && <p style={{ color: "#dc2626", fontSize: "13px", marginTop: "8px" }}>{formError}</p>}
      </div>

      {favorites.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No favorites yet. Add a country above to keep track of its data.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => {
              const country = countries.find((c) => c.id === fav.country_id);
              const countryCode = country?.Code;
              return (
                <tr key={fav.id}>
                  <td>{country ? country.Title : `Country #${fav.country_id}`}</td>
                  <td>{fav.notes || "—"}</td>
                  <td style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    {countryCode && (
                      <Link to={`/trends?country=${countryCode}`}>View trends</Link>
                    )}
                    <button
                      onClick={() => handleDelete(fav.id)}
                      style={{ background: "#d93025", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default Favorites;
