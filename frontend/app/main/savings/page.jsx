'use client';

import { useState, useEffect } from 'react';
import Forest from '@/components/Forest';
import SavingsTreeSlider from '@/components/SavingsTreeSlider';

// Mock data for initial development
const mockGoalStatus = {
  goal_name: "New Car",
  current_amount: 1500,
  goal_amount: 5000,
  progress_percentage: 30
};

export default function SavingsPage() {
  const [goalStatus, setGoalStatus] = useState(mockGoalStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, date: '2023-05-10', amount: 200, type: 'deposit' },
    { id: 2, date: '2023-05-05', amount: 300, type: 'deposit' },
    { id: 3, date: '2023-04-28', amount: 500, type: 'deposit' },
  ]);

  useEffect(() => {
    const fetchGoalStatus = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call once backend is ready
        // const response = await fetch('http://localhost:5001/api/savings-goal-status');
        // const data = await response.json();
        // setGoalStatus(data);
      } catch (err) {
        setError('Failed to fetch goal status');
        console.error('Error fetching goal status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalStatus();
  }, []);

  // Handle progress update from slider
  const handleUpdateProgress = (newProgress, newAmount) => {
    setGoalStatus({
      ...goalStatus,
      current_amount: newAmount,
      progress_percentage: newProgress
    });
    
    // Add to activity log if amount increased
    if (newAmount > goalStatus.current_amount) {
      const newActivity = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        amount: newAmount - goalStatus.current_amount,
        type: 'deposit'
      };
      
      setRecentActivity([newActivity, ...recentActivity]);
    }
    
    // TODO: Make API call to update progress
    // fetch('/api/update-savings', { method: 'POST', body: JSON.stringify({ amount: newAmount }) })
  };

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">🌱</span>
        Money Tree: {goalStatus.goal_name}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Tree Slider Component */}
          <SavingsTreeSlider 
            initialProgress={goalStatus.progress_percentage}
            currentAmount={goalStatus.current_amount}
            goalAmount={goalStatus.goal_amount}
            onUpdateProgress={handleUpdateProgress}
          />
          
          {/* Goal Information */}
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Goal Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Goal Name:</span>
                <span className="font-semibold">{goalStatus.goal_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Amount:</span>
                <span className="font-semibold">${goalStatus.goal_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Savings:</span>
                <span className="font-semibold">${goalStatus.current_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Still Needed:</span>
                <span className="font-semibold">${(goalStatus.goal_amount - goalStatus.current_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <ul className="divide-y divide-green-100">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="py-3 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.date}</p>
                      <p className="text-xs text-gray-500">{activity.type}</p>
                    </div>
                    <p className="text-green-600 font-medium">+${activity.amount}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Forest Visualization */}
        <Forest currentProgress={goalStatus.progress_percentage} />
      </div>
    </div>
  );
} 