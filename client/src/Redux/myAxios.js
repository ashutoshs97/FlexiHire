import axios from "axios";

// Use process.env.REACT_APP_API_URL for environment variables in create-react-app
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default axios.create({
  baseURL,
});