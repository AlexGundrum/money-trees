import React from 'react';

const CarWindows = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Windows */}
      <path
        d="M50,55 L60,40 L130,40 L140,55 Z"
        fill="#93C5FD"
        stroke="#2563EB"
        strokeWidth="1"
      />
      {/* Windshield divider */}
      <line
        x1="95" y1="40" x2="95" y2="55"
        stroke="#2563EB"
        strokeWidth="1"
      />
    </svg>
  );
};

export default CarWindows; 