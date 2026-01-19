import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy handles the rest
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
