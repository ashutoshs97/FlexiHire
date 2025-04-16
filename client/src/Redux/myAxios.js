import axios from "axios";

// Ensure the base URL is set properly from environment variables
const baseURL = process.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error("REACT_APP_API_URL is not defined in the environment variables.");
}

console.log("API Base URL: ", baseURL); // You can remove this after confirming the correct URL

// Create the axios instance with the provided base URL and a 10-second timeout
export default axios.create({
  baseURL,
  timeout: 10000, // Optional: Add a timeout for API requests (10 seconds)
});
