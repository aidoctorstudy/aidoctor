import axios from "axios";

// The backend is an OPTIONAL live enhancement. On frontend-only hosts (e.g. Vercel)
// REACT_APP_BACKEND_URL is not set / the API is unreachable, so every call here must
// degrade gracefully and NEVER return a non-array/non-object shape to the UI.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export async function fetchStats() {
  if (!API) return null;
  try {
    const { data } = await axios.get(`${API}/stats`, { timeout: 8000 });
    return isPlainObject(data) ? data : null;
  } catch {
    return null;
  }
}

export async function fetchReviews() {
  if (!API) return [];
  try {
    const { data } = await axios.get(`${API}/reviews`, { timeout: 8000 });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function joinWaitlist(payload) {
  if (!API) throw new Error("Waitlist is unavailable right now.");
  const { data } = await axios.post(`${API}/waitlist`, payload);
  return data;
}
