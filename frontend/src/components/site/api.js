import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export async function fetchStats() {
  const { data } = await axios.get(`${API}/stats`);
  return data;
}

export async function fetchReviews() {
  const { data } = await axios.get(`${API}/reviews`);
  return data;
}

export async function joinWaitlist(payload) {
  const { data } = await axios.post(`${API}/waitlist`, payload);
  return data;
}
