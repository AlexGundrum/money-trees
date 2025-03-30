'use client';

import { useState, useEffect } from 'react';
import Tree from '@/components/Tree';

export default function ForestPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Housing', budget: 1200, spent: 1150, progress: 96 },
    { id: 2, name: 'Food', budget: 500, spent: 350, progress: 70 },
    { id: 3, name: 'Transportation', budget: 300, spent: 275, progress: 92 },
    { id: 4, name: 'Entertainment', budget: 200, spent: 80, progress: 40 },
    { id: 5, name: 'Savings', budget: 400, spent: 400, progress: 100 },
    { id: 6, name: 'Healthcare', budget: 150, spent: 0, progress: 0 },
  ]);
  
  const [totalStats, setTotalStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    overallProgress: 0
  });
  
  // Calculate total stats
  useEffect(() => {
    const totalBudget = categories.reduce((acc, cat) => acc + cat.budget, 0);
    const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
    const overallProgress = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;
    
    setTotalStats({
      totalBudget,
      totalSpent,
      overallProgress
    });
  }, [categories]);
  
  const handleUpdateCategory = (id, newAmount) => {
    setCategories(categories.map(cat => {
      if (cat.id === id) {
        const progress = Math.round((newAmount / cat.budget) * 100);
        return { ...cat, spent: newAmount, progress };
      }
      return cat;
    }));
  };
  
  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">🌲</span>
        Your Financial Forest
      </h1>
      
      {/* Overview Card */}
      <div className="card hover:border-green-200 mb-8">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Monthly Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-green-700">${totalStats.totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-amber-600">${totalStats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Remaining</p>
            <p className="text-2xl font-bold text-blue-600">${(totalStats.totalBudget - totalStats.totalSpent).toLocaleString()}</p>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>0%</span>
            <span className="font-medium">{totalStats.overallProgress}% Spent</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                totalStats.overallProgress > 95 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${totalStats.overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Budget Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map(category => (
          <CategoryCard 
            key={category.id}
            category={category}
            onUpdate={(amount) => handleUpdateCategory(category.id, amount)}
          />
        ))}
      </div>
      
      {/* Forest Tips */}
      <div className="mt-8 card hover:border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Forest Financial Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <span className="text-green-500 text-xl">🌱</span>
            <div>
              <p className="font-medium text-green-800">Grow Your Emergency Fund</p>
              <p className="text-sm text-gray-600">Aim for 3-6 months of expenses in an easily accessible account.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-500 text-xl">🌿</span>
            <div>
              <p className="font-medium text-green-800">Prune Unnecessary Expenses</p>
              <p className="text-sm text-gray-600">Review subscriptions and services you don't fully use.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-500 text-xl">🌲</span>
            <div>
              <p className="font-medium text-green-800">Plant Seeds for Retirement</p>
              <p className="text-sm text-gray-600">Contribute regularly to retirement accounts for long-term growth.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-500 text-xl">🌳</span>
            <div>
              <p className="font-medium text-green-800">Diversify Your Forest</p>
              <p className="text-sm text-gray-600">Don't put all your financial trees in one spot - diversify investments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Card Component
const CategoryCard = ({ category, onUpdate }) => {
  const [spentAmount, setSpentAmount] = useState(category.spent);
  
  const handleSliderChange = (e) => {
    const newAmount = parseInt(e.target.value, 10);
    setSpentAmount(newAmount);
    onUpdate(newAmount);
  };
  
  // Determine warning levels
  const getStatusColor = (progress) => {
    if (progress >= 100) return 'text-red-600';
    if (progress >= 85) return 'text-amber-600';
    return 'text-green-600';
  };
  
  return (
    <div className="card hover:border-green-200 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-green-800">{category.name}</h3>
        <span className={`font-medium ${getStatusColor(category.progress)}`}>
          {category.progress}%
        </span>
      </div>
      
      {/* Tree visualization - smaller version */}
      <div className="h-32 flex justify-center">
        <Tree progress={category.progress} />
      </div>
      
      <div className="mt-3 space-y-2">
        <p className="text-sm text-center">
          <span className="text-gray-600">Spent: </span>
          <span className={getStatusColor(category.progress)}>
            ${spentAmount.toLocaleString()}
          </span>
          <span className="text-gray-600"> of ${category.budget.toLocaleString()}</span>
        </p>
        
        {/* Slider to adjust amount */}
        <input
          type="range"
          min="0"
          max={category.budget * 1.5}
          value={spentAmount}
          onChange={handleSliderChange}
          className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        
        {/* Warning for overbudget */}
        {category.progress > 100 && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded p-2 text-center">
            <p className="text-xs text-red-600">
              ⚠️ Over budget by ${(category.spent - category.budget).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 