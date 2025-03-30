import React from 'react';

const CarDetails = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Door lines */}
      <line x1="70" y1="55" x2="70" y2="80" stroke="#2563EB" strokeWidth="1" />
      <line x1="120" y1="55" x2="120" y2="80" stroke="#2563EB" strokeWidth="1" />
      
      {/* Door handles */}
      <line x1="60" y1="65" x2="65" y2="65" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="125" y1="65" x2="130" y2="65" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      
      {/* Bumpers */}
      <line x1="15" y1="75" x2="20" y2="75" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      <line x1="180" y1="75" x2="185" y2="75" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default CarDetails; 