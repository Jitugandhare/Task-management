import axios from "axios";
import { BASE_URL } from "./apiPaths"; 

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
     Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally (optional)
    if(error.response){
        if (error.response && error.response.status === 401) {
            // Example: Redirect to login on unauthorized (401)
            window.location.href = "/login";
          }else if(error.response.status===500){
            console.error("Server error, Please try again")
          }
    }else if(error.code==="ECONNABORTED"){
        console.error("Request Timeout,Please try again.")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
