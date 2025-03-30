'use client';

import { useState, useEffect } from 'react';
import { Leaf, Calendar, Clock, CheckCircle, Award, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';
import Tree from '@/components/Tree';

export default function ForestPage() {
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'First Sapling', description: 'Created your first budget category tree', date: 'Mar 5, 2025', completed: true },
    { id: 2, name: 'Budget Master', description: 'Stayed under budget for 3 consecutive months', date: 'Apr 10, 2025', completed: true },
    { id: 3, name: 'Saving Superstar', description: 'Reached 50% of your savings goal', date: 'May 22, 2025', completed: true },
    { id: 4, name: 'Forest Keeper', description: 'Track spending daily for 2 weeks', date: 'Jun 15, 2025', completed: false },
    { id: 5, name: 'Financial Freedom', description: 'Pay off all credit card debt', date: null, completed: false },
  ]);

  // Spending categories - same data as throughout the app
  const categories = [
    { id: 1, name: 'Housing', budget: 1200, spent: 1150, progress: 96 },
    { id: 2, name: 'Food', budget: 450, spent: 350, progress: 78 },
    { id: 3, name: 'Transportation', budget: 300, spent: 275, progress: 92 },
    { id: 4, name: 'Entertainment', budget: 150, spent: 80, progress: 53 },
    { id: 5, name: 'Utilities', budget: 200, spent: 190, progress: 95 },
    { id: 6, name: 'Education', budget: 300, spent: 300, progress: 100 },
  ];

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">🌳</span>
        Your Financial Forest
      </h1>

      {/* Forest Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card hover:border-green-200 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Financial Growth Forest</h2>
              <p className="text-sm text-gray-600 mb-6">Watch your forest grow as you manage your budget categories.</p>
              
              {/* Trees Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="relative bg-gradient-to-b from-green-50 to-transparent p-4 rounded-lg text-center"
                  >
                    <div className="h-28 flex justify-center items-center mb-2">
                      <Tree progress={category.progress} />
                    </div>
                    <h3 className="font-medium text-green-800 text-sm">{category.name}</h3>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${
                          category.progress > 95 ? 'bg-red-500' : 
                          category.progress > 80 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${category.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-600">
                      <span>${category.spent}</span>
                      <span>${category.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="lg:col-span-1">
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Monthly Overview</h2>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <Calendar size={20} className="text-green-700 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">Budget Period</h3>
                  <p className="text-sm text-gray-600">June 1-30, 2025</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm font-medium">Total Budget</span>
                </div>
                <span className="font-bold text-green-800">${totalBudget}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm font-medium">Total Spent</span>
                </div>
                <span className="font-bold text-amber-600">${totalSpent}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm font-medium">Remaining</span>
                </div>
                <span className="font-bold text-blue-600">${totalRemaining}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-green-100">
              <div className="text-center">
                <h3 className="font-medium text-green-800 mb-2">Forest Status</h3>
                <div className="inline-block bg-green-100 text-green-800 text-sm font-medium rounded-full px-3 py-1">
                  {Math.round((totalSpent / totalBudget) * 100)}% Growth Progress
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Your forest is growing at a healthy pace!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements & Tips Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <Award size={20} className="text-green-600 mr-2" /> 
              Financial Achievements
            </h2>
            
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg ${achievement.completed ? 'bg-green-50' : 'bg-gray-50'} flex items-start`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${achievement.completed ? 'bg-green-100' : 'bg-gray-200'} flex items-center justify-center mr-3`}>
                    {achievement.completed ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <Target size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${achievement.completed ? 'text-green-800' : 'text-gray-700'}`}>
                        {achievement.name}
                      </h3>
                      {achievement.date && (
                        <span className={`text-xs ${achievement.completed ? 'text-green-600' : 'text-gray-500'} bg-white px-2 py-1 rounded-full ml-2`}>
                          {achievement.date}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-center">
              <Link 
                href="/main/achievements"
                className="text-sm text-green-600 font-medium hover:text-green-700 hover:underline flex items-center"
              >
                View all achievements
                <TrendingUp size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Financial Tips */}
        <div className="lg:col-span-1">
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Forest Tips</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-1">Grow Faster</h3>
                <p className="text-sm text-gray-600">Set up automatic transfers to your savings account to help your financial forest flourish.</p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-1">Pest Control</h3>
                <p className="text-sm text-gray-600">Review your subscriptions monthly to eliminate unnecessary expenses that drain your resources.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-1">Water Your Trees</h3>
                <p className="text-sm text-gray-600">Track your expenses weekly to ensure steady growth of your financial forest.</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Clock size={16} className="inline text-green-600 mr-1" />
              <span className="text-xs text-gray-500">Updated June 8, 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 