import React from 'react';
import CarFrame from './carParts/CarFrame';
import CarWindows from './carParts/CarWindows';
import CarWheels from './carParts/CarWheels';
import CarLights from './carParts/CarLights';
import CarDetails from './carParts/CarDetails';

const CarAssembly = ({ progress = 0 }) => {
  // Calculate which parts to show based on progress
  // 0-20%: Frame only
  // 21-40%: Frame + Wheels
  // 41-60%: Frame + Wheels + Windows
  // 61-80%: Frame + Wheels + Windows + Lights
  // 81-100%: Complete car with all details

  const showFrame = progress > 0;
  const showWheels = progress > 20;
  const showWindows = progress > 40;
  const showLights = progress > 60;
  const showDetails = progress > 80;

  const baseStyles = "absolute inset-0 transition-opacity duration-700";

  return (
    <div className="relative w-full h-full">
      {/* Hint text when no progress */}
      {progress === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-center">
            Start saving to build your car!
          </p>
        </div>
      )}

      {/* Sky/Road background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100">
        <div className="absolute bottom-0 w-full h-1/4 bg-green-600" />
      </div>

      {/* Car Components */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-md h-full max-h-48">
          {showFrame && (
            <CarFrame className={`${baseStyles} ${showFrame ? 'opacity-100' : 'opacity-0'}`} />
          )}
          
          {showWheels && (
            <CarWheels className={`${baseStyles} ${showWheels ? 'opacity-100' : 'opacity-0'}`} />
          )}
          
          {showWindows && (
            <CarWindows className={`${baseStyles} ${showWindows ? 'opacity-100' : 'opacity-0'}`} />
          )}
          
          {showLights && (
            <CarLights className={`${baseStyles} ${showLights ? 'opacity-100' : 'opacity-0'}`} />
          )}
          
          {showDetails && (
            <CarDetails className={`${baseStyles} ${showDetails ? 'opacity-100' : 'opacity-0'}`} />
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium">
        {Math.round(progress)}% Complete
      </div>
      
      {/* Milestone markers */}
      <div className="absolute bottom-2 left-0 w-full flex justify-between px-4 text-xs text-gray-600">
        <span className={progress > 0 ? "text-blue-600 font-bold" : ""}>Start</span>
        <span className={progress > 25 ? "text-blue-600 font-bold" : ""}>|</span>
        <span className={progress > 50 ? "text-blue-600 font-bold" : ""}>Halfway</span>
        <span className={progress > 75 ? "text-blue-600 font-bold" : ""}>|</span>
        <span className={progress >= 100 ? "text-blue-600 font-bold" : ""}>Goal!</span>
      </div>
    </div>
  );
};

export default CarAssembly; 