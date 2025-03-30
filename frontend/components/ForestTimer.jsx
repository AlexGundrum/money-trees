import React, { useState, useEffect } from 'react';

/**
 * ForestTimer component inspired by the Forest app's focus timer
 * This component allows users to start a timer to grow a tree while focused on saving money
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Callback function when timer completes
 * @param {Function} props.onFailure - Callback function when timer is abandoned
 */
const ForestTimer = ({ onComplete, onFailure }) => {
  // Timer states
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // Default 30 minutes in seconds
  const [selectedTime, setSelectedTime] = useState(30);
  const [treeStage, setTreeStage] = useState(0); // 0: seed, 1: small, 2: medium, 3: full-grown
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Timer options
  const timerOptions = [
    { value: 5, label: '5 min' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
  ];

  // Update timer every second
  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          if (timeLeft <= 1) {
            clearInterval(interval);
            setIsActive(false);
            if (onComplete) onComplete();
            return 0;
          }
          
          // Update tree stage based on progress
          const totalTime = selectedTime * 60;
          const progress = 1 - (timeLeft - 1) / totalTime;
          
          if (progress >= 0.85 && treeStage < 3) {
            setTreeStage(3);
          } else if (progress >= 0.5 && treeStage < 2) {
            setTreeStage(2);
          } else if (progress >= 0.2 && treeStage < 1) {
            setTreeStage(1);
          }
          
          return timeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, onComplete, selectedTime, treeStage]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer start
  const startTimer = () => {
    setTimeLeft(selectedTime * 60);
    setTreeStage(0);
    setIsActive(true);
    setIsPaused(false);
  };

  // Handle timer pause
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // Handle timer resume
  const resumeTimer = () => {
    setIsPaused(false);
  };

  // Handle timer reset
  const resetTimer = () => {
    setIsModalOpen(false);
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedTime * 60);
    setTreeStage(0);
    if (onFailure) onFailure();
  };

  // Handle timer select
  const handleSelectTime = (value) => {
    if (!isActive) {
      setSelectedTime(value);
      setTimeLeft(value * 60);
    }
  };

  // Determine tree emoji based on stage
  const getTreeEmoji = () => {
    switch (treeStage) {
      case 0: return '🌱';
      case 1: return '🌿';
      case 2: return '🌲';
      case 3: return '🌳';
      default: return '🌱';
    }
  };

  // Calculate progress percentage
  const progressPercentage = isActive 
    ? Math.round(((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100)
    : 0;

  return (
    <div className="card hover:border-green-200 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-green-50 to-transparent rounded-t-lg z-0"></div>
      
      <h2 className="text-xl font-semibold text-green-800 mb-4 text-center relative z-10">
        Focus on Saving
      </h2>
      
      {/* Timer Display */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-block bg-green-50 px-6 py-3 rounded-full shadow-sm mb-2">
          <div className="text-5xl font-bold text-green-700">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress bar */}
        {isActive && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 mt-4">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}
        
        {/* Tree visualization */}
        <div className="my-6 flex justify-center">
          <div className={`text-7xl animate-${isActive && !isPaused ? 'sway' : ''} filter drop-shadow-sm`}>
            {getTreeEmoji()}
          </div>
        </div>
        
        {/* Status message */}
        <p className="text-sm text-green-600 mb-4 bg-green-50 inline-block px-4 py-2 rounded-full">
          {!isActive && "Plant a tree and focus on saving money"}
          {isActive && !isPaused && "Your tree is growing. Stay focused!"}
          {isActive && isPaused && "Timer paused. Resume to keep growing your tree."}
        </p>
      </div>
      
      {/* Timer Controls */}
      <div className="space-y-4 relative z-10">
        {!isActive ? (
          <>
            {/* Timer Options */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {timerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectTime(option.value)}
                  className={`py-2 px-2 rounded-lg text-sm transition-colors ${
                    selectedTime === option.value
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Start Button */}
            <button
              onClick={startTimer}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              Plant Tree & Start
            </button>
          </>
        ) : (
          <div className="space-y-3">
            {!isPaused ? (
              <button
                onClick={pauseTimer}
                className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Resume
              </button>
            )}
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              Give Up
            </button>
          </div>
        )}
      </div>
      
      {/* Abandon Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-xl border border-red-100">
            <div className="text-center mb-4">
              <span className="text-3xl">🥀</span>
              <h3 className="text-xl font-bold mt-2">Are you sure?</h3>
            </div>
            <p className="mb-6 text-gray-600 text-center">
              If you give up now, your tree will die and your progress will be lost!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Growing
              </button>
              <button
                onClick={resetTimer}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Give Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForestTimer; 