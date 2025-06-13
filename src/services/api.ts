import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://tu-api-en-produccion.com';

const api = axios.create({
  baseURL: API_URL,
});

export default api;