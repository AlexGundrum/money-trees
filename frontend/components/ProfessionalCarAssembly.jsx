import React from 'react';
import Image from 'next/image';

const ProfessionalCarAssembly = ({ progress = 0 }) => {
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
  const showComplete = progress >= 100;

  return (
    <div className="relative w-full h-full">
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

      {/* Sky/Road background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100">
        <div className="absolute bottom-0 w-full h-1/3 bg-green-600" />
      </div>

      {/* Car Components */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-md h-64 flex items-center justify-center">
          {showComplete ? (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
              <div className="w-full max-w-md flex items-center justify-center">
                <Image
                  src="/images/car-parts/car-complete.svg"
                  alt="Complete car"
                  width={300}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            </div>
          ) : (
            <>
              {/* Frame */}
              {showFrame && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
                  <div className="w-full max-w-md flex items-center justify-center">
                    <Image
                      src="/images/car-parts/car-frame.svg"
                      alt="Car frame"
                      width={300}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
              
              {/* Wheels */}
              {showWheels && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
                  <div className="w-full max-w-md flex items-center justify-center">
                    <Image
                      src="/images/car-parts/car-wheels.svg"
                      alt="Car wheels"
                      width={300}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
              
              {/* Windows */}
              {showWindows && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
                  <div className="w-full max-w-md flex items-center justify-center">
                    <Image
                      src="/images/car-parts/car-windows.svg"
                      alt="Car windows"
                      width={300}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
              
              {/* Lights */}
              {showLights && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
                  <div className="w-full max-w-md flex items-center justify-center">
                    <Image
                      src="/images/car-parts/car-lights.svg"
                      alt="Car lights"
                      width={300}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
              
              {/* Details */}
              {showDetails && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700">
                  <div className="w-full max-w-md flex items-center justify-center">
                    <Image
                      src="/images/car-parts/car-details.svg"
                      alt="Car details"
                      width={300}
                      height={150}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-4 py-2 rounded-full text-sm font-bold shadow-md">
        {Math.round(progress)}% Complete
      </div>
      
      {/* Milestone markers */}
      <div className="absolute bottom-2 left-0 w-full flex justify-between px-4 text-xs font-medium">
        <span className={`transition-colors ${progress > 0 ? "text-blue-600" : "text-gray-600"}`}>Frame</span>
        <span className={`transition-colors ${progress > 20 ? "text-blue-600" : "text-gray-600"}`}>Wheels</span>
        <span className={`transition-colors ${progress > 40 ? "text-blue-600" : "text-gray-600"}`}>Windows</span>
        <span className={`transition-colors ${progress > 60 ? "text-blue-600" : "text-gray-600"}`}>Lights</span>
        <span className={`transition-colors ${progress > 80 ? "text-blue-600" : "text-gray-600"}`}>Details</span>
      </div>
    </div>
  );
};

export default ProfessionalCarAssembly; 