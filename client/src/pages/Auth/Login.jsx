import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../customcomponent/Input'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();


    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }



    // Optionally, you could add a regex to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(''); 
    


  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black' >
          Welcome Back
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6' >Please enter your details to log in</p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Min 8 Characters"
            type="password"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type='submit' className='w-full text-sm font-medium text-white bg-black shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 hover:bg-blue-600/15 hover:text-blue-600 cursor-pointer'>
            LOGIN
          </button>

          <p>
            Don't have an account?{' '}
            <Link className='font-medium text-blue-600 underline' to='/signup' >SignUp</Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  )
}

export default Login
