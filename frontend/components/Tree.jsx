import React from 'react';

/**
 * Tree component for the Forest-themed savings visualization.
 * The tree grows based on the user's progress towards their savings goal.
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 */
const Tree = ({ progress }) => {
  // Determine the tree state based on progress
  let treeSize = 'text-5xl';
  let treeType = '🌱'; // Seed/sprout
  let soilColor = 'bg-amber-700';
  let animation = '';
  
  if (progress >= 20) {
    treeType = '🌿'; // Small plant
    treeSize = 'text-6xl';
  }
  
  if (progress >= 40) {
    treeType = '🌲'; // Medium tree
    treeSize = 'text-7xl';
    animation = 'animate-sway';
  }
  
  if (progress >= 60) {
    treeType = '🌳'; // Large tree
    animation = 'animate-sway';
  }
  
  if (progress >= 80) {
    treeType = '🌳'; // Full tree
    treeSize = 'text-8xl';
    animation = 'animate-sway';
  }
  
  if (progress >= 100) {
    // Add sparkling effect to the completed tree
    animation = 'animate-glow';
  }

  // Determine if we should show falling leaves
  const showFallingLeaves = progress >= 60;
  
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Sky background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent rounded-lg"></div>
      
      {/* Falling leaves animation */}
      {showFallingLeaves && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute animate-falling-leaves text-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: '-10px',
                animationDelay: `${i * 1.5}s`
              }}
            >
              {i % 2 === 0 ? '🍃' : '🍂'}
            </div>
          ))}
        </div>
      )}
      
      {/* Tree container */}
      <div className="relative flex flex-col items-center justify-center h-48 z-10">
        {/* Tree */}
        <div className={`${treeSize} ${animation} z-10 mb-2 transform-gpu filter drop-shadow-md`}>
          {treeType}
        </div>
        
        {/* Ground/Soil */}
        <div className="absolute bottom-0 w-32 h-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full"></div>
        
        {/* Ground texture */}
        <div className="absolute bottom-0 w-28 h-3 bg-amber-800 bg-opacity-20 rounded-full"></div>
        
        {/* Sun - only appears at 50% or higher */}
        {progress >= 50 && (
          <div className="absolute top-0 right-4 text-3xl animate-pulse">
            ☀️
          </div>
        )}
        
        {/* Birds - only appear at 70% or higher */}
        {progress >= 70 && (
          <div className="absolute top-8 left-0 text-sm animate-bounce">
            🐦
          </div>
        )}
        
        {/* Squirrel - only appears at complete */}
        {progress >= 90 && (
          <div className="absolute bottom-6 right-4 text-sm">
            🐿️
          </div>
        )}
      </div>
      
      {/* Progress text */}
      <div className="text-center mt-4 z-10">
        <p className="text-green-800 font-medium">
          {progress}% Complete
        </p>
      </div>
    </div>
  );
};

export default Tree; 