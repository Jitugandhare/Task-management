import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../customcomponent/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  // State hooks for managing form inputs and error messages
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { updatedUser } = useContext(UserContext)

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
      updatedUser(response.data)
      if (token) {
        localStorage.setItem("token", token); // Storing the token in localStorage

        // Redirect based on user role
        if (role === 'admin') {
          navigate('/admin/dashboard'); // Correct path
        } else {
          navigate('/user/dashboard'); // Correct path
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
