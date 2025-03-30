'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for initial development
const mockGoalStatus = {
  goal_name: "Car",
  current_amount: 1500,
  goal_amount: 5000,
  progress_percentage: 30
};

export default function SavingsPage() {
  const [goalStatus, setGoalStatus] = useState(mockGoalStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Savings Goal: {goalStatus.goal_name}</h1>
        <Link 
          href="/main/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>${goalStatus.current_amount}</span>
            <span>${goalStatus.goal_amount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${goalStatus.progress_percentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-center text-lg font-semibold">
          {goalStatus.progress_percentage}% Complete
        </p>
      </div>

      {/* Car Visualization */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Your Car Coming Together</h2>
        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
          {/* This is a placeholder for the car visualization */}
          {/* In a real implementation, you would have car part images that appear based on progress */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Car Visualization Placeholder</p>
              <p className="text-sm text-gray-400">
                Progress: {goalStatus.progress_percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 