import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // MEMPERBAIKI BUG: Wajib mengembalikan config agar request tidak macet (stuck)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
