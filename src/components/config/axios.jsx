import axios from 'axios';

// Create a new Axios instance
export const axiosInstance = axios.create({
  baseURL: 'https://andrew-demo.onrender.com', // Set the base URL for all requests
  //   timeout: 5000, // Set a timeout of 5 seconds for all requests
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json', // Set the Content-Type header for all requests to JSON
    token: localStorage.getItem('token'), // Set the Authorization header with a JWT token from local storage
  },
});
