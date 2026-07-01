import { useEffect, useRef } from "react";

function Hero({ onGetStarted, countryCount = 0, indicatorCount = 0 }) {
  const crossLayer = useRef(null);

  const stats = [
    { value: String(countryCount), label: "Countries" },
    { value: String(indicatorCount), label: "Indicators" },
    { value: "3", label: "Ways to explore" },
  ];

  useEffect(() => {
    const layer = crossLayer.current;
    if (!layer) return;

    const crosses = [];
    for (let i = 0; i < 14; i++) {
      const c = document.createElement("span");
      const size = 8 + Math.random() * 14;
      c.textContent = "+";
      c.className = "hero-cross";
      c.style.left = `${Math.random() * 100}%`;
      c.style.fontSize = `${size}px`;
      c.style.animationDuration = `${6 + Math.random() * 6}s`;
      c.style.animationDelay = `${Math.random() * 6}s`;
      layer.appendChild(c);
      crosses.push(c);
    }

    return () => crosses.forEach((c) => c.remove());
  }, []);

  return (
    <section className="hero">
      <div className="hero-banner">
        <div className="hero-cross-layer" ref={crossLayer} aria-hidden="true" />
        <div className="hero-content">
          <h1 className="hero-title">Explore global health, country by country</h1>
          <p className="hero-subtitle">
            Life expectancy, immunization, and disease burden across the countries
            and indicators our team tracks - all in one place.
          </p>
          {onGetStarted && (
            <button className="hero-cta" onClick={onGetStarted}>
              Get started →
            </button>
          )}
        </div>
      </div>

      <div className="hero-stats">
        {stats.map(({ value, label }) => (
          <div className="hero-stat" key={label}>
            <div className="hero-stat-value">{value}</div>
            <div className="hero-stat-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;
