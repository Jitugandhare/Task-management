import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ label, type, value, onChange, placeholder, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="text-[14px] text-slate-800">{label}</label>
      <div className="input-box">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>

      {/* {error && <div className="text-red-500 text-xs pb-2.5">{error}</div>} You can display an error if needed */}
    </div>
  );
};

export default Input;





{/* <div className="mb-4">
{label && <label className="text-[13px] text-slate-800  ">{label}</label>}
<input
  type={type}
  value={value}
  onChange={onChange}
  placeholder={placeholder}
  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'
    }`}
/>
{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
</div> */}