import axios from "axios";

// Use process.env.REACT_APP_API_URL for environment variables in create-react-app
const baseURL = process.env.REACT_APP_API_URL || "https://flexihire-immj.onrender.com";

export default axios.create({
  baseURL,
});