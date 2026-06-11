function StatCard({ title, value, unit, year, country }) {
  const display =
    value !== null && value !== undefined
      ? Number(value).toFixed(1)
      : "—";

  return (
    <div className="stat-card">
      <p className="stat-label">{title}</p>
      <p className="stat-value">
        {display}
        {unit && <span className="stat-unit"> {unit}</span>}
      </p>
      {(country || year) && (
        <p className="stat-meta">
          {[country, year].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

export default StatCard;
