// client/src/Redux/myAxios.js

import axios from "axios";

// For debugging
console.log("API Base URL:", process.env.REACT_APP_API_URL);

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default instance;
