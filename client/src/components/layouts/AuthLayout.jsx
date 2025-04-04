import React from 'react';
import UI_Image from '../../assets/ui-image/auth-img.png';
import Background_image from '../../assets/ui-image/bg-img.png'
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Content Section */}
      <div className="w-full h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-bold text-black">Task Manager</h2>
        {children}
      </div>

      {/* Image Section */}
      <div 
        className="hidden md:flex  w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8" 
        style={{ backgroundImage: `url(${Background_image})` }}
      >
        <img src={UI_Image} alt="UI Image" className="w-64 lg:w-[85%]" />
      </div>
    </div>
  );
} 

export default AuthLayout;


// bg-[url('/bg-img.png')]