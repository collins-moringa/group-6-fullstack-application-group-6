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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// Historical indicator values, stored entirely in our own database
export async function getIndicatorData(code, countryCode) {
  const params = { indicator_code: code };
  if (countryCode) params.country_code = countryCode;
  const res = await api.get("/data-points", { params });
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

// Indicators
export async function getIndicators() {
  const res = await api.get("/indicators");
  return res.data; // [{ id, code, name, unit, IndicatorCode, IndicatorName }]
}

export async function addIndicator(data) {
  const res = await api.post("/indicators", data);
  return res.data;
}

export async function updateIndicator(id, data) {
  const res = await api.put(`/indicators/${id}`, data);
  return res.data;
}

export async function deleteIndicator(id) {
  const res = await api.delete(`/indicators/${id}`);
  return res.data;
}

// Auth
export async function login(username, password) {
  const res = await api.post("/auth/login", { username, password });
  return res.data; // { token, user: { id, username, is_admin } }
}

// Admin
export async function getUsers() {
  const res = await api.get("/admin/users");
  return res.data;
}

// Data points (manual per-country/indicator/year values)
export async function getDataPoints() {
  const res = await api.get("/data-points");
  return res.data;
}

export async function addDataPoint(data) {
  const res = await api.post("/data-points", data);
  return res.data;
}

export async function updateDataPoint(id, data) {
  const res = await api.put(`/data-points/${id}`, data);
  return res.data;
}

export async function deleteDataPoint(id) {
  const res = await api.delete(`/data-points/${id}`);
  return res.data;
}
