import React from 'react';

const CarLights = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Headlights */}
      <rect x="25" y="60" width="10" height="5" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
      <rect x="165" y="60" width="10" height="5" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
      
      {/* Taillights */}
      <rect x="180" y="60" width="5" height="5" rx="1" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
      <rect x="15" y="60" width="5" height="5" rx="1" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
    </svg>
  );
};

export default CarLights; 