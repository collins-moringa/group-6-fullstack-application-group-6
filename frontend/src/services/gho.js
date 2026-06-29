// const BASE_URL = "/api";
// async function apiFetch(path) {
//   const res = await fetch(`${BASE_URL}${path}`);
//   if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
//   const { value } = await res.json();
//   return value;
// }

// export async function getIndicators() {
//   const rows = await apiFetch("/Indicator");
//   console.log("Indicators:", rows);
//   return rows.map(({ IndicatorCode, IndicatorName }) => ({ IndicatorCode, IndicatorName }));
// }

// export async function getCountries() {
//   const rows = await apiFetch("/DIMENSION/COUNTRY/DimensionValues");
//   console.log("Countries:", rows);
//   return rows
//     .map(({ Code, Title }) => ({ Code, Title }))
//     .sort((a, b) => a.Title.localeCompare(b.Title));
// }

// export async function getIndicatorData(code, countryCode) {
//   const filter = countryCode ? `?$filter=SpatialDim eq '${countryCode}'` : "";
//   return apiFetch(`/${code}${filter}`);
// }

import axios from "axios";

const BASE_URL = "http://localhost:5000"; // or your deployed backend URL
const api = axios.create({ baseURL: BASE_URL });

// Countries
export async function getCountries() {
  const res = await api.get("/countries");
  return res.data; // [{ id, name, code }]
}

export async function addCountry(data) {
  const res = await api.post("/countries", data);
  return res.data;
}

export async function updateCountry(id, data) {
  const res = await api.put(`/countries/${id}`, data);
  return res.data;
}

export async function deleteCountry(id) {
  const res = await api.delete(`/countries/${id}`);
  return res.data;
}

// Favorites
export async function getFavorites() {
  const res = await api.get("/favorites");
  return res.data; // [{ id, countryId, note }]
}

export async function addFavorite(data) {
  const res = await api.post("/favorites", data);
  return res.data;
}

export async function updateFavorite(id, data) {
  const res = await api.put(`/favorites/${id}`, data);
  return res.data;
}

export async function deleteFavorite(id) {
  const res = await api.delete(`/favorites/${id}`);
  return res.data;
}
