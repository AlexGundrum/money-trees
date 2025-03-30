import React from 'react';

const SimpleCar = ({ progress = 0 }) => {
  // Calculate which parts to show based on progress
  const showFrame = progress > 0;
  const showWheels = progress > 20;
  const showWindows = progress > 40;
  const showLights = progress > 60;
  const showDetails = progress > 80;

  return (
    <div className="relative w-full h-full">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100">
        <div className="absolute bottom-0 w-full h-1/4 bg-green-600" />
      </div>
      
      {/* Car Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-36">
          {/* Car Frame */}
          {showFrame && (
            <div className="absolute w-64 h-16 bg-blue-600 rounded-lg bottom-0 transition-opacity duration-300 ease-in-out"></div>
          )}
          
          {/* Car Roof */}
          {showWindows && (
            <div className="absolute w-48 h-10 bg-blue-800 rounded-t-lg left-1/2 transform -translate-x-1/2 bottom-16 transition-opacity duration-300 ease-in-out"></div>
          )}
          
          {/* Car Windows */}
          {showWindows && (
            <div className="absolute w-40 h-8 bg-blue-300 rounded-t-lg left-1/2 transform -translate-x-1/2 bottom-14 transition-opacity duration-300 ease-in-out"></div>
          )}
          
          {/* Car Wheels */}
          {showWheels && (
            <>
              <div className="absolute w-12 h-12 bg-gray-800 rounded-full left-10 bottom-0 border-4 border-gray-400 transition-opacity duration-300 ease-in-out"></div>
              <div className="absolute w-12 h-12 bg-gray-800 rounded-full right-10 bottom-0 border-4 border-gray-400 transition-opacity duration-300 ease-in-out"></div>
            </>
          )}
          
          {/* Car Lights */}
          {showLights && (
            <>
              <div className="absolute w-6 h-4 bg-yellow-400 rounded left-0 bottom-8 transition-opacity duration-300 ease-in-out"></div>
              <div className="absolute w-6 h-4 bg-yellow-400 rounded right-0 bottom-8 transition-opacity duration-300 ease-in-out"></div>
            </>
          )}
          
          {/* Car Details */}
          {showDetails && (
            <>
              <div className="absolute w-12 h-0.5 bg-white left-1/2 transform -translate-x-1/2 bottom-14 transition-opacity duration-300 ease-in-out"></div>
              <div className="absolute w-1 h-4 bg-gray-400 left-1/3 bottom-6 transition-opacity duration-300 ease-in-out"></div>
              <div className="absolute w-1 h-4 bg-gray-400 right-1/3 bottom-6 transition-opacity duration-300 ease-in-out"></div>
            </>
          )}
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-bold">
        {Math.round(progress)}% Complete
      </div>
    </div>
  );
};

export default SimpleCar; 