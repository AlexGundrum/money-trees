import React from 'react';

const ForestThemeCarAssembly = ({ progress = 0 }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="absolute bottom-0 w-full h-1/4 bg-emerald-100" />
      </div>

      {/* Content container - centered */}
      <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center gap-6 px-4 z-10">
        {/* Car example */}
        <div className="w-full aspect-video bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-full w-full flex items-center justify-center">
            {progress === 0 ? (
              <div className="text-center p-6">
                <p className="text-lg font-semibold text-gray-800">Start saving for your dream car!</p>
                <p className="text-sm text-gray-600 mt-2">Set a goal and watch your progress</p>
              </div>
            ) : (
              <>
                {/* Simple car illustration */}
                <div className="relative">
                  {/* Car body */}
                  <div className="w-64 h-24 bg-blue-500 rounded-lg"></div>
                  
                  {/* Car roof */}
                  <div className="absolute top-2 left-16 w-32 h-14 bg-blue-600 rounded-t-lg"></div>
                  
                  {/* Wheels */}
                  <div className="absolute bottom-0 left-8 transform translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute bottom-0 right-8 transform translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-200"></div>
                  
                  {/* Windows */}
                  <div className="absolute top-6 left-20 w-24 h-8 bg-cyan-200 rounded"></div>
                </div>
                
                {/* Progress overlay */}
                <div 
                  className="absolute top-0 right-0 bottom-0 bg-white bg-opacity-70 transition-all duration-500 ease-out"
                  style={{ width: `${100 - progress}%` }}
                ></div>
              </>
            )}
          </div>
        </div>

        {/* Goal details */}
        <div className="w-full bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Car Savings Goal</h3>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-800">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            {progress < 100 
              ? `Keep saving! You're on your way.` 
              : `Congratulations! Goal achieved.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestThemeCarAssembly; 