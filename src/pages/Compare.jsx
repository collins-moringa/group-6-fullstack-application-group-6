import { useState, useEffect } from "react";
import { getCountries, getIndicatorData } from "../services/gho";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Compare() {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState(["KEN", "UGA"]); 
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const INDICATOR_CODE = "WHOSIS_000001"; // Life expectancy at birth

  // Load the initial country dropdown list
  useEffect(() => {
    getCountries()
      .then((res) => setCountries(res))
      .catch((err) => console.log("Failed to load country list:", err));
  }, []);

  // Track and fetch data for selected countries
  useEffect(() => {
    if (selectedCountries.length < 2) return;
    
    setIsLoading(true);
    setApiError(null);

    // Map through chosen countries and pull data for each
    const fetchPromises = selectedCountries.map((code) => {
      return getIndicatorData(INDICATOR_CODE, code)
        .then((dataRows) => {
          // Filter out missing data and ensure we get the overall total 
          const cleanRows = dataRows.filter(row => row.TimeDim && row.NumericValue && row.Dim1 === "BTSX");
          
          if (cleanRows.length === 0) {
            return { code, year: "N/A", score: 0 };
          }
          
          // Grab the most recent year's record
          const latestRecord = cleanRows.sort((x, y) => y.TimeDim - x.TimeDim)[0];
          
          return {
            code,
            year: latestRecord.TimeDim,
            score: parseFloat(latestRecord.NumericValue.toFixed(1))
          };
        });
    });

    Promise.all(fetchPromises)
      .then((finalDataset) => setChartData(finalDataset))
      .catch((err) => setApiError(err.message || "Could not fetch comparison data"))
      .finally(() => setIsLoading(false));
  }, [selectedCountries]);

  // Handle checking and unchecking countries (Limit: 2-4)
  const toggleCountrySelection = (code) => {
    const isAlreadySelected = selectedCountries.includes(code);

    if (isAlreadySelected) {
      if (selectedCountries.length <= 2) {
        alert("Please pick at least 2 countries to compare.");
        return;
      }
      setSelectedCountries(selectedCountries.filter(item => item !== code));
    } else {
      if (selectedCountries.length >= 4) {
        alert("Maximum limit is 4 countries.");
        return;
      }
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  if (isLoading && chartData.length === 0) return <Loading />;
  if (apiError) return <ErrorMessage message={apiError} />;

  return (
    <div style={{ padding: "24px", maxWidth: "850px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "8px" }}>Country Comparison Dashboard</h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Compare <strong>Life Expectancy at Birth</strong> side-by-side across 2 to 4 countries.
      </p>

      {/* Checklist Box */}
      <div style={{ 
        border: "1px solid #ccc", 
        padding: "16px", 
        borderRadius: "6px", 
        marginBottom: "24px",
        maxHeight: "160px", 
        overflowY: "auto",
        background: "#fafafa"
      }}>
        <b style={{ display: "block", marginBottom: "10px" }}>Select Countries to Compare:</b>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
          {countries.map((item) => (
            <label key={item.Code} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={selectedCountries.includes(item.Code)}
                onChange={() => toggleCountrySelection(item.Code)}
              />
              {item.Title || item.Code}
            </label>
          ))}
        </div>
      </div>

      {isLoading && <p style={{ color: "#888", fontStyle: "italic" }}>Refreshing chart data...</p>}

      {/* CSS Bar Chart */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {chartData.map((row) => {
          const match = countries.find(c => c.Code === row.code);
          const name = match ? match.Title : row.code;
          const percentageWidth = Math.min((row.score / 95) * 100, 100);

          return (
            <div key={row.code} style={{ display: "grid", gridTemplateColumns: "160px 1fr 70px", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {name}
              </div>
              
              <div style={{ background: "#eaeaea", borderRadius: "2px", height: "20px", width: "100%" }}>
                <div style={{ 
                  width: `${percentageWidth}%`, 
                  background: "#2563eb", 
                  height: "100%", 
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "8px",
                  boxSizing: "border-box",
                  transition: "width 0.4s ease-out"
                }}>
                  {row.score > 0 && <span style={{ color: "#fff", fontSize: "11px", fontWeight: "600" }}>{row.score}</span>}
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "#777", textAlign: "right" }}>
                Year: {row.year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Compare;