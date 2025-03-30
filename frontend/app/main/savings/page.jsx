'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CarAssembly from '../../../components/CarAssembly';
import SimpleCar from '../../../components/SimpleCar';
import ProfessionalCarAssembly from '../../../components/ProfessionalCarAssembly';
import BackupCarAssembly from '../../../components/BackupCarAssembly';
import ForestThemeCarAssembly from '../../../components/ForestThemeCarAssembly';
import AddSavingsGoalForm from '../../../components/AddSavingsGoalForm';
import ContributionForm from '../../../components/ContributionForm';

export default function SavingsPage() {
  const [goalStatus, setGoalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [contributionHistory, setContributionHistory] = useState([]);
  const [carError, setCarError] = useState(false);

  useEffect(() => {
    // Check local storage for saved goal
    const fetchSavedGoal = () => {
      setLoading(true);
      try {
        const savedGoal = localStorage.getItem('carSavingsGoal');
        const savedContributions = localStorage.getItem('contributionHistory');
        
        if (savedGoal) {
          setGoalStatus(JSON.parse(savedGoal));
        }
        
        if (savedContributions) {
          setContributionHistory(JSON.parse(savedContributions));
        }
      } catch (err) {
        console.error('Error fetching saved goal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedGoal();
  }, []);

  const handleAddGoal = (newGoal) => {
    setGoalStatus(newGoal);
    setShowAddGoalForm(false);
    // Save to local storage
    localStorage.setItem('carSavingsGoal', JSON.stringify(newGoal));
    localStorage.setItem('contributionHistory', JSON.stringify([]));
    setContributionHistory([]);
  };

  const handleContribute = (amount) => {
    if (!goalStatus) return;
    
    const newCurrentAmount = goalStatus.current_amount + amount;
    const newProgressPercentage = Math.min(
      (newCurrentAmount / goalStatus.goal_amount) * 100, 
      100
    );
    
    const updatedGoal = {
      ...goalStatus,
      current_amount: newCurrentAmount,
      progress_percentage: newProgressPercentage
    };
    
    // Add to contribution history
    const newContribution = {
      id: Date.now(),
      amount,
      date: new Date().toISOString()
    };
    
    const updatedHistory = [...contributionHistory, newContribution];
    
    // Update state and save to local storage
    setGoalStatus(updatedGoal);
    setContributionHistory(updatedHistory);
    localStorage.setItem('carSavingsGoal', JSON.stringify(updatedGoal));
    localStorage.setItem('contributionHistory', JSON.stringify(updatedHistory));
  };

  const resetGoal = () => {
    if (confirm('Are you sure you want to reset your savings goal? This will delete all progress.')) {
      localStorage.removeItem('carSavingsGoal');
      localStorage.removeItem('contributionHistory');
      setGoalStatus(null);
      setContributionHistory([]);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your savings goal...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {goalStatus ? `Savings Goal: ${goalStatus.goal_name}` : 'Savings Goals'}
        </h1>
        <Link 
          href="/main/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Empty State */}
      {!goalStatus && !showAddGoalForm && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">You don't have any savings goals yet</h2>
          <p className="text-gray-600 mb-6">
            Set a goal to save for a car and watch it come together piece by piece as you save!
          </p>
          <button
            onClick={() => setShowAddGoalForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Savings Goal
          </button>
        </div>
      )}

      {/* Add Goal Form */}
      {showAddGoalForm && (
        <div className="mb-8">
          <AddSavingsGoalForm
            onAddGoal={handleAddGoal}
            onCancel={() => setShowAddGoalForm(false)}
          />
        </div>
      )}

      {/* Active Goal */}
      {goalStatus && (
        <>
          {/* Contribution Form */}
          <ContributionForm
            onContribute={handleContribute}
            currentAmount={goalStatus.current_amount}
            goalAmount={goalStatus.goal_amount}
          />

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>${goalStatus.current_amount.toFixed(2)}</span>
              <span>${goalStatus.goal_amount.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${goalStatus.progress_percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-gray-700 font-medium">
                {goalStatus.progress_percentage.toFixed(1)}% Complete
              </p>
              <button
                onClick={resetGoal}
                className="text-red-600 text-sm hover:underline"
              >
                Reset Goal
              </button>
            </div>
          </div>

          {/* Car Visualization */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Your Car Coming Together</h2>
            <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
              {/* Debug progress value */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-10 text-xs">
                Progress: {goalStatus.progress_percentage}%
              </div>
              
              {/* Try to use the forest theme car visualization */}
              {carError ? (
                <BackupCarAssembly progress={goalStatus.progress_percentage} />
              ) : (
                <div onError={() => setCarError(true)}>
                  <ForestThemeCarAssembly progress={goalStatus.progress_percentage} />
                </div>
              )}
            </div>
          </div>

          {/* Contribution History */}
          {contributionHistory.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Contribution History</h2>
              <div className="overflow-auto max-h-60">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contributionHistory.map((contribution) => (
                      <tr key={contribution.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contribution.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${contribution.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 