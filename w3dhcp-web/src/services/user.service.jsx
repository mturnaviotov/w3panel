import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8082/api/v1/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  const heads = authHeader()
  axios.defaults.headers.common = { 'auth-token': heads, 'Accept': 'application/json', 'Content-Type': 'application/json' }
  return axios.get(API_URL + "resellers", '', {});
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default userService