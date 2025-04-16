import axios from "axios";

// Use process.env.REACT_APP_API_URL for environment variables in create-react-app
const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error("REACT_APP_API_URL is not defined in the environment variables.");
}

export default axios.create({
  baseURL,
  timeout: 10000, // Optional: Add a timeout for API requests (10 seconds)
});