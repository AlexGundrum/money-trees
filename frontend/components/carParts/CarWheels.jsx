import React from 'react';

const CarWheels = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wheels */}
      <circle cx="50" cy="80" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
      <circle cx="150" cy="80" r="10" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
      
      {/* Wheel details */}
      <circle cx="50" cy="80" r="3" fill="#E5E7EB" />
      <circle cx="150" cy="80" r="3" fill="#E5E7EB" />
    </svg>
  );
};

export default CarWheels; 