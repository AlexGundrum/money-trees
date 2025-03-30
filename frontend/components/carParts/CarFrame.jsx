import React from 'react';

const CarFrame = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car Body/Frame */}
      <path
        d="M20,70 L35,70 L45,55 L145,55 L160,70 L180,70 L180,80 L20,80 Z"
        fill="#2563EB"
        stroke="#1E40AF"
        strokeWidth="3"
      />
    </svg>
  );
};

export default CarFrame; 