import axios from "axios";
import env from "../config/Config";

const apiPublic = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: (status) =>
    (status >= 200 && status < 300) ||
    status === 400 ||
    status === 404,
});

export default apiPublic;
