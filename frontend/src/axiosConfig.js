import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE
});

export default api;
