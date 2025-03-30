import React from 'react';
import Tree from './Tree';

/**
 * Forest component displays multiple trees representing user's savings history.
 * Each tree represents a completed saving period, creating a forest visualization.
 * 
 * @param {Object} props Component props
 * @param {number} props.currentProgress - Current savings goal progress (0-100)
 * @param {Array} props.completedGoals - Array of completed savings goals
 */
const Forest = ({ currentProgress = 30, completedGoals = [] }) => {
  // We'll use a default of 2 completed goals if none are provided
  const defaultCompletedGoals = [
    { id: 1, name: 'Emergency Fund', progress: 100 },
    { id: 2, name: 'Vacation', progress: 100 }
  ];
  
  const goals = completedGoals.length > 0 ? completedGoals : defaultCompletedGoals;
  
  return (
    <div className="h-full flex flex-col">
      <div className="card hover:border-green-200 flex-grow">
        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-transparent rounded-t-lg z-0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-50 to-transparent rounded-b-lg z-0"></div>
        
        <h3 className="text-lg font-semibold text-green-800 mb-2 relative z-10">Your Savings Forest</h3>
        <p className="text-sm text-green-700 mb-6 relative z-10">
          Watch your forest grow as you reach your savings goals!
        </p>
        
        {/* Current tree in progress */}
        <div className="bg-white rounded-lg p-5 mb-6 shadow-sm border border-green-100 relative z-10">
          <h4 className="text-md font-medium text-green-800 mb-2">Current Goal</h4>
          <div className="h-48">
            <Tree progress={currentProgress} />
          </div>
        </div>
        
        {/* Forest of completed trees */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-green-100 relative z-10">
          <h4 className="text-md font-medium text-green-800 mb-3">Your Forest</h4>
          
          {goals.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-green-50 rounded-lg p-3 text-center transition-all hover:bg-green-100">
                  <div className="h-24 flex items-center justify-center">
                    <span className="text-4xl filter drop-shadow-sm">🌳</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1 font-medium">{goal.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 bg-green-50 rounded-lg">
              <span className="text-3xl mb-2">🌱</span>
              <p className="text-sm text-gray-500 text-center">
                Complete your first goal to start your forest!
              </p>
            </div>
          )}
          
          {/* Plant real trees section */}
          <div className="mt-6 bg-gradient-to-r from-green-100 to-green-50 rounded p-4 border border-green-200">
            <h4 className="text-sm font-medium text-green-800 flex items-center">
              <span className="mr-2">🌎</span> Plant Real Trees
            </h4>
            <p className="text-xs text-green-700 mt-1 mb-3">
              For every 3 virtual trees you grow, we'll plant a real tree!
            </p>
            <div className="w-full bg-white rounded-full h-2.5 mb-1">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all" 
                style={{ width: `${Math.min((goals.length / 3) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-green-700">Progress</span>
              <span className="text-green-800 font-medium">
                {Math.floor(goals.length / 3)} real trees planted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forest; 