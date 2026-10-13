import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Buang karakter nyasar sebelum JSON
  transformResponse: [
    (data) => {
      if (typeof data !== 'string') return data;
      const start = data.search(/[\[{]/);
      try {
        return JSON.parse(start > 0 ? data.slice(start) : data);
      } catch {
        return data;
      }
    },
  ],
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
