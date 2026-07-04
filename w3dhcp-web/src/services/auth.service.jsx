import axios from "axios";

const API_URL = "http://localhost:8082/api/v1/";

const register = (args) => {
  return axios.post(API_URL + "users/register", args)
}

const login = (username, password) => {
  return axios
    .post(API_URL + "sign_in", {
      user: {
        email: username,
        password: password,
      }
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.token));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
