// frontend/src/api.js
import axios from 'axios';

// When deployed, Netlify uses the REACT_APP_API_URL variable
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default api;