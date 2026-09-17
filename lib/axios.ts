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
    // WAJIB TAMBAHKAN BARIS INI:
    return config; 
  },
  // WAJIB TAMBAHKAN PENANGANAN ERROR INI JUGA:
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
