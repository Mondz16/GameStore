import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5210",
  withCredentials: false,
});

export default API;
