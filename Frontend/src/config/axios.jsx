import axios from "axios";
const baseUrl = "https://localhost:7219/api/";
// const baseUrl = "https://backendeventflowerexchange-3.onrender.com/api/";

const config = {
  baseUrl: baseUrl,
};
  
const api = axios.create(config);

api.defaults.baseURL = baseUrl;

// handle before call API
const handleBefore = (config) => {
  // handle hành động trước khi call API

  // lấy ra cái token và đính kèm theo cái request
  const token = sessionStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore, (error) => {
  return Promise.reject(error);
});

export default api;
