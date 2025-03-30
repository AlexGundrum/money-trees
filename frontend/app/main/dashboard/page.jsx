// frontend/app/main/dashboard/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getAIFinancialAdvice } from '@/services/api';
import Link from 'next/link';
import TransactionCategoryChart from '@/components/charts/TransactionCategoryChart';
import Tree from '@/components/Tree';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Mock data for initial development

const mockInsights = {
  good_habits: [
    "You're consistently saving 20% of your income!",
    "Great job on limiting entertainment expenses this month."
  ],
  bad_habits: [
    "Consider reducing your dining out expenses.",
    "Watch out for frequent small purchases at convenience stores."
  ]
};

// Forest-themed color palette for the pie chart
const forestColors = {
  bg: [
    "rgba(46, 164, 79, 0.7)",    // Green - Savings
    "rgba(209, 73, 91, 0.7)",    // Red - Housing
    "rgba(254, 161, 21, 0.7)",   // Orange - Food
    "rgba(56, 148, 198, 0.7)",   // Blue - Transportation
    "rgba(128, 90, 213, 0.7)",   // Purple - Entertainment
    "rgba(22, 135, 167, 0.7)",   // Teal - Utilities
    "rgba(244, 195, 27, 0.7)",   // Yellow - Education
  ],
  border: [
    "rgba(46, 164, 79, 1)",      // Green
    "rgba(209, 73, 91, 1)",      // Red
    "rgba(254, 161, 21, 1)",     // Orange
    "rgba(56, 148, 198, 1)",     // Blue
    "rgba(128, 90, 213, 1)",     // Purple
    "rgba(22, 135, 167, 1)",     // Teal
    "rgba(244, 195, 27, 1)",     // Yellow
  ]
};

// Mock spending data for pie chart
const spendingData = {
  labels: ["Savings", "Housing", "Food", "Transportation", "Entertainment", "Utilities", "Education"],
  datasets: [
    {
      label: "Monthly Budget Allocation ($)",
      data: [520, 1200, 450, 300, 150, 200, 300],
      backgroundColor: forestColors.bg,
      borderColor: forestColors.border,
      borderWidth: 1,
    },
  ],
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        padding: 15,
        color: '#2c3e50'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: $${value} (${percentage}%)`;
        }
      },
      backgroundColor: 'rgba(46, 164, 79, 0.8)',
      titleFont: {
        family: "'Inter', sans-serif"
      },
      bodyFont: {
        family: "'Inter', sans-serif"
      },
      padding: 12,
      cornerRadius: 8
    },
    title: {
      display: true,
      text: 'Monthly Budget Allocation',
      font: {
        size: 16,
        family: "'Inter', sans-serif",
        weight: 'bold',
        color: '#2c3e50'
      },
      padding: 20
    }
  }
};

// Optional: Add metadata specific to this page
// export const metadata = {
//   title: 'Dashboard - FinStudent',
// };

export default function DashboardPage() {
  const [insights, setInsights] = useState(mockInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(spendingData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const lastFetchRef = useRef(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchInsights = async () => {
      const now = Date.now();
      // Only fetch if 5 minutes have passed since last fetch
      if (now - lastFetchRef.current < 5 * 60 * 1000) {
        return;
      }

      setLoading(true);
      try {
        const data = await getAIFinancialAdvice();
        setInsights(data);
        lastFetchRef.current = now;
      } catch (err) {
        setError('Failed to fetch insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []); // Only run on mount

  // Function to handle category selection
  const handleCategorySelect = (index) => {
    if (selectedCategory === index) {
      setSelectedCategory(null);
      setChartData(spendingData); // Reset to original data
    } else {
      setSelectedCategory(index);
      
      // Make a copy of the chart data
      const newData = JSON.parse(JSON.stringify(spendingData));
      
      // Update background colors to highlight the selected category
      const newBackgroundColors = [...newData.datasets[0].backgroundColor];
      for (let i = 0; i < newBackgroundColors.length; i++) {
        if (i !== index) {
          newBackgroundColors[i] = newBackgroundColors[i].replace("0.7", "0.3"); // Make non-selected categories more transparent
        }
      }
      
      newData.datasets[0].backgroundColor = newBackgroundColors;
      setChartData(newData);
    }
  };

  const llm_data = {
    "financial_analysis_request": {
      "time_period": "Current Month",
      "total_spending": 2600,
      "currency": "USD",
      "categories": [
        {"name": "Housing", "total": 1200},
        {"name": "Food", "total": 450},
        {"name": "Transportation", "total": 300},
        {"name": "Entertainment", "total": 150},
        {"name": "Utilities", "total": 200},
        {"name": "Education", "total": 300}
      ],
      "income": 3120,
      "savings_goal": 2000,
      "current_savings": 600
    }
  };
  
  // Category details for when a category is selected
  const getCategoryDetails = (index) => {
    if (index === null) return null;
    
    const categories = {
      0: { // Savings
        title: "Savings Breakdown",
        items: [
          { label: "Emergency Fund", amount: 300 },
          { label: "Car Fund", amount: 150 },
          { label: "Vacation Fund", amount: 70 },
        ]
      },
      1: { // Housing
        title: "Housing Breakdown",
        items: [
          { label: "Rent/Mortgage", amount: 1000 },
          { label: "Insurance", amount: 100 },
          { label: "Property Tax", amount: 100 },
        ]
      },
      2: { // Food
        title: "Food Breakdown",
        items: [
          { label: "Groceries", amount: 300 },
          { label: "Dining Out", amount: 150 },
        ]
      },
      3: { // Transportation
        title: "Transportation Breakdown",
        items: [
          { label: "Gas", amount: 150 },
          { label: "Public Transit", amount: 100 },
          { label: "Car Maintenance", amount: 50 },
        ]
      },
      4: { // Entertainment
        title: "Entertainment Breakdown",
        items: [
          { label: "Streaming Services", amount: 50 },
          { label: "Movies/Events", amount: 70 },
          { label: "Hobbies", amount: 30 },
        ]
      },
      5: { // Utilities
        title: "Utilities Breakdown",
        items: [
          { label: "Electricity", amount: 80 },
          { label: "Water", amount: 40 },
          { label: "Internet", amount: 60 },
          { label: "Phone", amount: 20 },
        ]
      },
      6: { // Education
        title: "Education Breakdown",
        items: [
          { label: "Tuition", amount: 200 },
          { label: "Books", amount: 50 },
          { label: "Online Courses", amount: 50 },
        ]
      },
    };
    
    return categories[index] || null;
  };

  const overallProgress = 75; // Placeholder for overall progress
  const savingsProgress = Math.round((llm_data.financial_analysis_request.current_savings / llm_data.financial_analysis_request.savings_goal) * 100);

  return (
    <div className="p-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="page-title flex items-center">
          <span className="text-green-500 mr-2">🏡</span>
          Your Financial Forest
        </h1>
        <div className="bg-green-50 rounded-lg overflow-hidden flex shadow-sm border border-green-100">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-100'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'insights' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-100'}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Financial Growth Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
            <div className="card hover:border-green-200 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
              <div className="absolute -left-8 -bottom-8 w-20 h-20 bg-green-50 rounded-full opacity-50"></div>
              
              <h2 className="text-xl font-semibold text-green-800 mb-3 relative z-10">Financial Growth</h2>
              <div className="p-4 bg-gradient-to-b from-green-50 to-transparent rounded-lg relative z-10">
                <div className="h-48 flex justify-center">
                  <Tree progress={overallProgress} />
                </div>
              </div>
              <p className="text-center text-sm text-green-600 mt-2 relative z-10">
                Your financial health is at {overallProgress}% of your goals
              </p>
            </div>
            
            <div className="card hover:border-green-200 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-20 h-20 bg-amber-50 rounded-full opacity-50"></div>
              <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-amber-50 rounded-full opacity-50"></div>
              
              <h2 className="text-xl font-semibold text-green-800 mb-3 relative z-10">Savings Progress</h2>
              <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-lg p-5 mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-700 font-medium">Current: ${llm_data.financial_analysis_request.current_savings}</span>
                  <span className="text-amber-700 font-medium">Goal: ${llm_data.financial_analysis_request.savings_goal}</span>
                </div>
                <div className="w-full bg-white h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-700"
                    style={{ width: `${savingsProgress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 font-medium text-green-700">{savingsProgress}% Complete</p>
                
                <div className="mt-6 flex justify-between">
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block mb-1">Monthly Income</span>
                    <span className="text-lg font-bold text-green-700">${llm_data.financial_analysis_request.income}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block mb-1">Monthly Expenses</span>
                    <span className="text-lg font-bold text-red-600">${llm_data.financial_analysis_request.total_spending}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block mb-1">Savings Rate</span>
                    <span className="text-lg font-bold text-green-700">20%</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                  Update Savings Goal
                </button>
              </div>
            </div>
          </div>

          {/* Chart and Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="card hover:border-green-200 md:col-span-2 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-50 rounded-full opacity-30"></div>
              
              <h2 className="text-xl font-semibold text-green-800 mb-3 relative z-10">Budget Allocation</h2>
              <div className="h-[350px] relative z-10">
                <Pie 
                  data={chartData} 
                  options={{
                    ...pieOptions,
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                        const index = elements[0].index;
                        handleCategorySelect(index);
                      }
                    }
                  }} 
                />
              </div>
              <p className="text-center text-sm text-green-600 mt-2 italic relative z-10">
                Click on a category to view detailed breakdown
              </p>
            </div>

            {/* Category Details or Tips */}
            <div className="card hover:border-green-200 overflow-auto max-h-[450px]">
              {selectedCategory !== null ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-green-800">
                    {spendingData.labels[selectedCategory]} Details
                  </h2>
                  <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-bold text-green-700">${spendingData.datasets[0].data[selectedCategory]}</span>
                  </div>
                  
                  {getCategoryDetails(selectedCategory) && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-green-700">
                        {getCategoryDetails(selectedCategory).title}
                      </h3>
                      <ul className="divide-y divide-green-100">
                        {getCategoryDetails(selectedCategory).items.map((item, i) => (
                          <li key={i} className="flex justify-between py-3 px-1 hover:bg-green-50 rounded">
                            <span>{item.label}</span>
                            <span className="font-medium">${item.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    className="mt-4 text-sm text-green-600 hover:text-green-800 hover:underline flex items-center"
                    onClick={() => handleCategorySelect(selectedCategory)}
                  >
                    <span className="mr-1">↩</span> Reset Selection
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-green-800">Spending Summary</h2>
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <p className="text-center text-gray-600">
                      Click on a category in the chart for details
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="font-medium text-green-700">Monthly Total:</p>
                      <p className="text-xl font-bold">${spendingData.datasets[0].data.reduce((a, b) => a + b, 0)}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="font-medium text-amber-700">Largest Expense:</p>
                      <p className="text-xl font-bold">{spendingData.labels[
                        spendingData.datasets[0].data.indexOf(
                          Math.max(...spendingData.datasets[0].data)
                        )
                      ]}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-blue-700">Smallest Expense:</p>
                      <p className="text-xl font-bold">{spendingData.labels[
                        spendingData.datasets[0].data.indexOf(
                          Math.min(...spendingData.datasets[0].data)
                        )
                      ]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Tips */}
          <div className="card hover:border-green-200 mb-8 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 text-9xl text-green-50 opacity-20">🌳</div>
            
            <h2 className="text-xl font-semibold text-green-800 mb-4 relative z-10">Financial Forest Tips</h2>
            <div className="grid md:grid-cols-3 gap-4 relative z-10">
              <div className="bg-green-50 p-4 rounded-lg hover:shadow-md transition-shadow hover:scale-[1.02] transform duration-200">
                <div className="flex items-center mb-3">
                  <span className="text-xl text-green-600 mr-2">🌱</span>
                  <h3 className="font-medium text-green-800">Start Small</h3>
                </div>
                <p className="text-sm text-gray-600">Begin with small, consistent contributions to your savings goals. Even $10 per week adds up over time.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg hover:shadow-md transition-shadow hover:scale-[1.02] transform duration-200">
                <div className="flex items-center mb-3">
                  <span className="text-xl text-green-600 mr-2">🌿</span>
                  <h3 className="font-medium text-green-800">Grow Steadily</h3>
                </div>
                <p className="text-sm text-gray-600">Increase your savings rate by 1% every few months to painlessly boost your long-term growth.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg hover:shadow-md transition-shadow hover:scale-[1.02] transform duration-200">
                <div className="flex items-center mb-3">
                  <span className="text-xl text-green-600 mr-2">🌳</span>
                  <h3 className="font-medium text-green-800">Diversify</h3>
                </div>
                <p className="text-sm text-gray-600">Like a healthy forest, a healthy financial portfolio has diversity. Consider multiple savings and investment options.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* AI Insights Tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Good Habits */}
            <div className="card hover:border-green-200 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 text-8xl text-green-50 opacity-20">🌲</div>
              
              <h2 className="text-xl font-semibold mb-4 text-green-800 relative z-10">Growth Areas</h2>
              {loading ? (
                <div className="flex items-center justify-center h-32 bg-green-50 rounded-lg">
                  <div className="animate-pulse text-green-500">Loading insights...</div>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
              ) : (
                <ul className="space-y-3 relative z-10">
                  {insights.good_habits.map((habit, index) => (
                    <li key={index} className="flex items-start p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                      <span className="text-green-500 mr-3 text-xl">🌱</span>
                      <div>
                        <p className="font-medium text-green-800 mb-1">Healthy Habit {index + 1}</p>
                        <p className="text-gray-700">{habit}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="card hover:border-green-200 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 text-8xl text-amber-50 opacity-20">✂️</div>
              
              <h2 className="text-xl font-semibold mb-4 text-amber-700 relative z-10">Areas to Prune</h2>
              {loading ? (
                <div className="flex items-center justify-center h-32 bg-amber-50 rounded-lg">
                  <div className="animate-pulse text-amber-500">Loading insights...</div>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
              ) : (
                <ul className="space-y-3 relative z-10">
                  {insights.bad_habits.map((habit, index) => (
                    <li key={index} className="flex items-start p-4 bg-amber-50 rounded-lg hover:shadow-md transition-shadow">
                      <span className="text-amber-500 mr-3 text-xl">✂️</span>
                      <div>
                        <p className="font-medium text-amber-800 mb-1">Improvement Opportunity {index + 1}</p>
                        <p className="text-gray-700">{habit}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Monthly Spending Trends */}
          <div className="card hover:border-green-200 mt-6 relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-50 rounded-full opacity-30"></div>
            
            <h2 className="text-xl font-semibold text-green-800 mb-4 relative z-10">Monthly Progress</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4 relative z-10">
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium text-green-700">Previous 3 Months</span>
                <span className="font-medium text-blue-700">Savings Growth</span>
              </div>
              <div className="flex h-48 items-end justify-around">
                {[60, 68, 75].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-16 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-700"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs mt-2 font-medium">
                      {['March', 'April', 'May'][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-green-600 relative z-10">
              Your financial forest is growing steadily each month!
            </p>
          </div>
          
          {/* Forest Actions */}
          <div className="card hover:border-green-200 mt-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
            
            <h2 className="text-xl font-semibold text-green-800 mb-4 relative z-10">Forest Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex flex-col items-center text-center shadow-sm">
                <span className="text-2xl mb-2">🌱</span>
                <span className="text-sm">Start New Savings Goal</span>
              </button>
              <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex flex-col items-center text-center shadow-sm">
                <span className="text-2xl mb-2">💧</span>
                <span className="text-sm">Add to Emergency Fund</span>
              </button>
              <button className="bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 transition-colors flex flex-col items-center text-center shadow-sm">
                <span className="text-2xl mb-2">✂️</span>
                <span className="text-sm">Cut Unnecessary Expense</span>
              </button>
              <button className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex flex-col items-center text-center shadow-sm">
                <span className="text-2xl mb-2">🔍</span>
                <span className="text-sm">Analyze Spending Habits</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}