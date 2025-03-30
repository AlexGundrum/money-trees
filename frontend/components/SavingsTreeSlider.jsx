import React, { useState, useEffect } from 'react';
import Tree from './Tree';

/**
 * SavingsTreeSlider component
 * Allows users to set their savings goal amount using a slider
 * The tree grows based on the percentage of the goal that has been reached
 * 
 * @param {Object} props Component props
 * @param {number} props.initialProgress - Initial progress percentage (0-100)
 * @param {number} props.currentAmount - Current saved amount
 * @param {number} props.goalAmount - Target goal amount
 * @param {Function} props.onUpdateProgress - Callback when progress is updated
 */
const SavingsTreeSlider = ({ 
  initialProgress = 30, 
  currentAmount = 1500, 
  goalAmount = 5000,
  onUpdateProgress 
}) => {
  const [sliderValue, setSliderValue] = useState(currentAmount);
  const [progress, setProgress] = useState(initialProgress);
  
  // Update progress when slider changes
  useEffect(() => {
    const newProgress = Math.min(100, Math.round((sliderValue / goalAmount) * 100));
    setProgress(newProgress);
    
    if (onUpdateProgress) {
      onUpdateProgress(newProgress, sliderValue);
    }
  }, [sliderValue, goalAmount, onUpdateProgress]);
  
  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };
  
  return (
    <div className="card relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute right-0 bottom-0 text-green-50 text-opacity-20 text-9xl pointer-events-none">
        🌳
      </div>
      
      <h2 className="text-xl font-semibold text-green-800 mb-4 text-center relative z-10">
        Grow Your Savings Tree
      </h2>
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Tree visualization */}
        <div className="w-full md:w-1/2">
          <div className="h-64">
            <Tree progress={progress} />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-6">
          {/* Savings statistics */}
          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <p className="text-center font-medium text-lg text-green-700">
              ${sliderValue.toLocaleString()} of ${goalAmount.toLocaleString()}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-green-600">
              {progress}% to your goal
            </p>
          </div>
          
          {/* Slider control */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-green-700">Adjust Your Savings</label>
            <input
              type="range"
              min="0"
              max={goalAmount * 1.2} // Allow slightly exceeding the goal
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-3 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>${Math.round(goalAmount * 0.25).toLocaleString()}</span>
              <span>${Math.round(goalAmount * 0.5).toLocaleString()}</span>
              <span>${Math.round(goalAmount * 0.75).toLocaleString()}</span>
              <span>${goalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Quick buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSliderValue(Math.max(0, sliderValue - 100))}
              className="py-2 px-3 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
            >
              -$100
            </button>
            <button
              onClick={() => setSliderValue(sliderValue + 100)}
              className="py-2 px-3 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            >
              +$100
            </button>
            <button
              onClick={() => setSliderValue(goalAmount)}
              className="py-2 px-3 bg-amber-100 text-amber-700 rounded text-sm hover:bg-amber-200 transition-colors"
            >
              Set to Goal
            </button>
          </div>
          
          {/* Achievement message */}
          {progress >= 100 && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative animate-pulse">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">✨</span>
                <div>
                  <p className="font-bold">Congratulations!</p>
                  <p className="text-sm">Your tree is fully grown! You've reached your savings goal.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsTreeSlider; 