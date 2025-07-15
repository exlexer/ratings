import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

api.interceptors.response.use(null, (error) => {
  return Promise.reject(error);
});

export default api;
