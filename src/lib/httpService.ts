import axios from 'axios';

// Create an Axios instance
const httpService = axios.create({
  baseURL: process.env.NEXT_API_URL,
  timeout: 10000, // Set a timeout for requests
});

// Add a request interceptor
httpService.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Set the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional, for handling responses globally)
httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default httpService;