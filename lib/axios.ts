import axios from 'axios';

const apiClient = axios.create({
  // URL ini membaca https://wasmer.app
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
    return config;
  },
  // WAJIB SERTAKAN BLOK ERROR INTERCEPTOR INI AGAR AXIOS TIDAK MACET
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
