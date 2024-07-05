
// Axios instance with interceptor to handle 401 errors
import axios from 'axios';


// Utility function to get the auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Utility function to check if the user is authenticated
const isAuthenticated = () => !!getAuthToken();

const axiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' }
});

// Add a request interceptor to include the auth token in requests
axiosInstance.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        // Handle 401 error (e.g., redirect to login page)
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default axiosInstance;
