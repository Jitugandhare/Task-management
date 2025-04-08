import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  // Format the value with a thousands separator
  const formattedValue = value.toLocaleString();

  return (
    <div className='flex items-center gap-3'>
      {/* Indicator with dynamic color */}
      <div className={`w-3 md:w-2.5 h-2.5 md:h-5 ${color} rounded-full`} />
      {/* Icon and label */}
      <div className='flex items-center gap-2'>
        {icon && <div className='icon'>{icon}</div>}
        <p className='text-xm md:text-[14px] text-gray-600 '>
          <span className='text-sm md:text-[15px] text-black font-semibold'>
            {formattedValue}
          </span>
         {" "}{label}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
