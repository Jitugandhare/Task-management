import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../customcomponent/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Login = () => {
  // State hooks for managing form inputs and error messages
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  // Hook for navigation after successful login
  const navigate = useNavigate();

  // Function to handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Basic validation checks for email and password fields
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    // Regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(''); // Clear any previous error messages

    try {
      // Making an API call to the login endpoint with email and password
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data; // Destructuring response data

      if (token) {
        localStorage.setItem("token", token); // Storing the token in localStorage

        // Redirect based on user role
        if (role === 'admin') {
          navigate('admin/dashboard'); // This will resolve to /login/admin/dashboard
        } else {
          navigate('user/dashboard'); // This will resolve to /login/user/dashboard
        }
        
      }
    } catch (error) {
      // Handle errors from the API request
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        console.error("Login failed:", error);
        setError("Something went wrong.Please try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>
          Welcome Back
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)} // Update email state on input change
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)} // Update password state on input change
            placeholder="Min 8 Characters"
            type="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>} {/* Show error message if any */}

          {/* Submit button */}
          <button
            type='submit'
            className='w-full text-sm font-medium text-white bg-black shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 hover:bg-blue-600/15 hover:text-blue-600 cursor-pointer'
          >
            LOGIN
          </button>

          {/* Link to sign-up page */}
          <p>
            Don't have an account?{' '}
            <Link className='font-medium text-blue-600 underline' to='/signup'>
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './routes/PrivateRoute';
import DashBoard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes (Protected) */}
        <Route element={<PrivateRoute allowedRoutes={['admin']} />}>
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-tasks" element={<CreateTask />} />
          <Route path="/admin/user" element={<ManageUsers />} />
        </Route>

        {/* User Routes (Protected) */}
        <Route element={<PrivateRoute allowedRoutes={['user']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/mytasks" element={<MyTasks />} />
          <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
import React from 'react'

const UserDashboard = () => {
  return (
    <div>
      <h1>UserDashboard</h1>
    </div>
  )
}

export default UserDashboard;


export const BASE_URL = "http://localhost:8000";


export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    },
    USERS: {
        GET_ALL_USERS: "/api/users", // Get all users (Admin only)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
        CREATE_USER: "/api/users", // Create a new user (Admin only)
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
        DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
    },
    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
        GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assigned)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
        CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist
    },
    REPORTS: {
        EXPORT_TASKS: '/api/reports/export/tasks',
        EXPORT_USERS: '/api/reports/export/users'
    },
    IMAGE: {
        UPLOAD_IMAGE: 'api/auth/upload-image'
    }
};
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
