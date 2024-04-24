import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'content_type': 'application/json'
  },
});

export default axiosInstance;