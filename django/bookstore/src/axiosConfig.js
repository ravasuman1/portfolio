// src/axiosConfig.js

import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your API base URL
  timeout: 10000, // Optional: set a timeout (in milliseconds)
  headers: {
    'Content-Type': 'application/json', // Default content type
    // You can add more default headers here
  },
});

// Optional: Add request interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config before sending it
    // For example, adding an authorization token:
    const token = localStorage.getItem('site'); // Or however you manage tokens
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optional: Add response interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle the response data
    return response.data; // Return only the data part of the response
  },
  (error) => {
    // Handle response error
    console.error('API call error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
