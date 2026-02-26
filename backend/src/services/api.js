import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3006/api/v1", // A szerver címe
});

// Kérés elkapása: Minden kérés előtt belerakja a tokent a fejlécbe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
