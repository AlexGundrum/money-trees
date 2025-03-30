import React from 'react';

const BackupCarAssembly = ({ progress = 0 }) => {
  // Calculate which parts to show based on progress
  const showFrame = progress > 0;
  const showWheels = progress > 20;
  const showWindows = progress > 40;
  const showLights = progress > 60;
  const showDetails = progress > 80;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-sky-100">
      {/* Road */}
      <div className="absolute bottom-0 w-full h-1/3 bg-green-600"></div>
      
      {/* Hint text when no progress */}
      {progress === 0 && (
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="translate-y-8">
            <p className="text-gray-700 text-center font-medium text-lg">
              Start saving to build your dream car!
            </p>
          </div>
        </div>
      )}
      
      {/* Car container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-40 flex items-center justify-center">
          {/* Car Body (Frame) */}
          {showFrame && (
            <div className="absolute left-0 right-0 bottom-4 h-16 bg-blue-500 rounded-xl transition-opacity duration-500"></div>
          )}
          
          {/* Windows */}
          {showWindows && (
            <>
              <div className="absolute left-1/4 right-1/4 bottom-20 h-8 bg-blue-400 rounded-t-lg transition-opacity duration-500"></div>
              <div className="absolute left-[30%] right-[30%] bottom-28 h-6 bg-blue-300 rounded-t-md transition-opacity duration-500"></div>
            </>
          )}
          
          {/* Wheels */}
          {showWheels && (
            <>
              <div className="absolute left-6 bottom-0 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-600 transition-opacity duration-500"></div>
              <div className="absolute right-6 bottom-0 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-600 transition-opacity duration-500"></div>
            </>
          )}
          
          {/* Lights */}
          {showLights && (
            <>
              <div className="absolute left-1 bottom-10 w-6 h-3 bg-yellow-400 rounded transition-opacity duration-500"></div>
              <div className="absolute right-1 bottom-10 w-6 h-3 bg-yellow-400 rounded transition-opacity duration-500"></div>
              <div className="absolute left-3 bottom-6 w-4 h-2 bg-red-500 rounded transition-opacity duration-500"></div>
              <div className="absolute right-3 bottom-6 w-4 h-2 bg-red-500 rounded transition-opacity duration-500"></div>
            </>
          )}
          
          {/* Details */}
          {showDetails && (
            <>
              <div className="absolute left-1/3 right-1/3 bottom-8 w-[33%] h-4 bg-blue-600 rounded-lg transition-opacity duration-500"></div>
              <div className="absolute left-[45%] right-[45%] bottom-6 w-[10%] h-2 bg-white rounded transition-opacity duration-500"></div>
              <div className="absolute left-1/4 bottom-16 h-12 w-[1px] bg-blue-700 transition-opacity duration-500"></div>
              <div className="absolute right-1/4 bottom-16 h-12 w-[1px] bg-blue-700 transition-opacity duration-500"></div>
              <div className="absolute left-[28%] bottom-12 w-4 h-1 bg-gray-400 rounded transition-opacity duration-500"></div>
              <div className="absolute right-[28%] bottom-12 w-4 h-1 bg-gray-400 rounded transition-opacity duration-500"></div>
            </>
          )}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-bold shadow-md">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default BackupCarAssembly; 