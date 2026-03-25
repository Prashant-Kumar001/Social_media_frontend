import axios from "axios";

const BASE_URL = import.meta.env.VITE_LOCAL_DB;

const api = axios.create({
  baseURL: `${BASE_URL}api/v1`,
});

export default api;
