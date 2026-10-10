import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let Axios set the correct Content-Type automatically.
    // JSON requests receive application/json.
    // FormData requests receive multipart/form-data with a boundary.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (config.data !== undefined && config.data !== null) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;