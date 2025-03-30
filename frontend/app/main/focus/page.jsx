'use client';

import { useState } from 'react';
import ForestTimer from '@/components/ForestTimer';

export default function FocusPage() {
  const [completedSessions, setCompletedSessions] = useState(0);
  const [failedSessions, setFailedSessions] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // Handle successful timer completion
  const handleTimerComplete = () => {
    setCompletedSessions(prev => prev + 1);
    const reward = 25; // Coins earned per session
    setCoins(prev => prev + reward);
    setShowReward(true);
    
    // Hide reward message after 5 seconds
    setTimeout(() => {
      setShowReward(false);
    }, 5000);
  };

  // Handle timer failure
  const handleTimerFailure = () => {
    setFailedSessions(prev => prev + 1);
  };

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">⏱️</span>
        Financial Focus
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {/* Timer Component */}
          <ForestTimer 
            onComplete={handleTimerComplete} 
            onFailure={handleTimerFailure} 
          />
          
          {/* Reward notification */}
          {showReward && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative animate-pulse">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">✨</span>
                <div>
                  <p className="font-bold">Great job!</p>
                  <p className="text-sm">You earned 25 coins for completing your session.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Your Focus Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-700">{completedSessions}</p>
                <p className="text-sm text-green-600">Sessions Completed</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-amber-700">{failedSessions}</p>
                <p className="text-sm text-amber-600">Sessions Failed</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center col-span-2">
                <p className="text-3xl font-bold text-blue-700">{coins}</p>
                <p className="text-sm text-blue-600">Coins Earned</p>
              </div>
            </div>
          </div>
          
          {/* Benefits Card */}
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Benefits of Focused Saving</h2>
            <ul className="space-y-3">
              <li className="flex items-start p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="text-green-500 mr-2">✓</span>
                <span>Develop a consistent savings habit</span>
              </li>
              <li className="flex items-start p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="text-green-500 mr-2">✓</span>
                <span>Reduce impulse purchases by focusing on goals</span>
              </li>
              <li className="flex items-start p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track your progress visually with growing trees</span>
              </li>
              <li className="flex items-start p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="text-green-500 mr-2">✓</span>
                <span>Earn rewards for consistent saving sessions</span>
              </li>
            </ul>
          </div>
          
          {/* Tips Card */}
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Financial Focus Tips</h2>
            <div className="space-y-3">
              <div className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="font-medium block">Set a regular schedule:</span>
                <p className="text-sm text-gray-600">Dedicate specific times for reviewing your finances.</p>
              </div>
              <div className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="font-medium block">Remove distractions:</span>
                <p className="text-sm text-gray-600">Turn off notifications during your financial focus time.</p>
              </div>
              <div className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="font-medium block">Start small:</span>
                <p className="text-sm text-gray-600">Begin with 15-minute sessions and gradually increase.</p>
              </div>
              <div className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                <span className="font-medium block">Celebrate milestones:</span>
                <p className="text-sm text-gray-600">Reward yourself (non-financially) when you reach goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 