import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default axios.create({
  baseURL,
});
