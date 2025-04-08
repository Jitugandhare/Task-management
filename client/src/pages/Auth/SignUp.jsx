import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../customcomponent/Input';
import ProfilePhotoSelector from '../../customcomponent/ProfilePhotoSelector';
import { UserContext } from '../../context/userContext';
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from '../../utils/uploadImage';
import {API_PATHS} from '../../utils/apiPaths'





const SignUp = () => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState('');
  const { updatedUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }
    if (!email) {
      setError("Please enter your email.");
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

    // Clear the error if everything is valid
    setError('');

    // Handle the API call for signing up here
    // You might want to add a successful sign-up action, e.g., redirect to the login page
    // navigate('/login'); // example of redirecting after successful sign up

    try {

      if(profilePic){
        const imgUploadRes=await uploadImage(profilePic);
        profileImageUrl=imgUploadRes.imageUrl || '';
      }



      // Making an API call to the Registration failed endpoint with email and password
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      });
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token)
        updatedUser(response.data)
      }
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard')
      }



    } catch (error) {
      // Handle errors from the API request
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        console.error("Registration failed failed:", error);
        setError("Something went wrong.Please try again.");
      }
    }



  };

  return (
    <AuthLayout>
      <div className='lg:w- [100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details below</p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <Input
              label="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
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
            <Input
              label="Admin Invite Token"
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              placeholder="6 Digit Code"
              type="number"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type='submit'
            className='w-full text-sm font-medium text-white bg-black shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 hover:bg-blue-600/15 hover:text-blue-600 cursor-pointer'
          >
            SIGN UP
          </button>

          <p>
            Already an account?{' '}
            <Link className='font-medium text-blue-600 underline' to='/login' >Loginin</Link>
          </p>





        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
