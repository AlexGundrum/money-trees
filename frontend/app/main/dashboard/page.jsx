// frontend/app/main/dashboard/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getAIFinancialAdvice } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, DollarSign, CreditCard, ShoppingBag, Coffee, Film, Utensils, Home, TrendingUp, BarChart, CheckCircle2, AlertCircle, TrendingDown, MinusIcon } from 'lucide-react';
import TransactionCategoryChart from '@/components/charts/TransactionCategoryChart';
import Tree from '@/components/Tree';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Consistent spending data across the application
const SPENDING_DATA = {
  categories: [
    { id: 1, name: 'Housing', budget: 1200, spent: 1150, progress: 96, icon: Home, color: 'rgba(209, 73, 91, 0.7)' },
    { id: 2, name: 'Food', budget: 450, spent: 350, progress: 78, icon: Utensils, color: 'rgba(254, 161, 21, 0.7)' },
    { id: 3, name: 'Transportation', budget: 300, spent: 275, progress: 92, icon: CreditCard, color: 'rgba(56, 148, 198, 0.7)' },
    { id: 4, name: 'Entertainment', budget: 150, spent: 80, progress: 53, icon: Film, color: 'rgba(128, 90, 213, 0.7)' },
    { id: 5, name: 'Utilities', budget: 200, spent: 190, progress: 95, icon: Home, color: 'rgba(22, 135, 167, 0.7)' },
    { id: 6, name: 'Education', budget: 300, spent: 300, progress: 100, icon: CreditCard, color: 'rgba(244, 195, 27, 0.7)' },
  ],
  savings: { budget: 520, spent: 520, progress: 100, color: 'rgba(46, 164, 79, 0.7)' },
  total: { budget: 3120, income: 3120 }
};

// Recent transactions data
const RECENT_TRANSACTIONS = [
  { 
    id: 1, 
    date: '2023-05-15', 
    merchant: 'Netflix', 
    amount: 14.99, 
    category: 'Entertainment',
    logo: '/logos/netflix.png',
    iconFallback: Film 
  },
  { 
    id: 2, 
    date: '2023-05-14', 
    merchant: 'Amazon', 
    amount: 67.84, 
    category: 'Shopping',
    logo: '/logos/amazon.png',
    iconFallback: ShoppingBag
  },
  { 
    id: 3, 
    date: '2023-05-13', 
    merchant: 'Starbucks', 
    amount: 6.45, 
    category: 'Food',
    logo: '/logos/starbucks.png',
    iconFallback: Coffee
  },
  { 
    id: 4, 
    date: '2023-05-12', 
    merchant: 'Uber', 
    amount: 24.30, 
    category: 'Transportation',
    logo: '/logos/uber.png',
    iconFallback: CreditCard
  },
  { 
    id: 5, 
    date: '2023-05-11', 
    merchant: 'Rent', 
    amount: 1200.00, 
    category: 'Housing',
    logo: '/logos/rent.png',
    iconFallback: Home
  },
  { 
    id: 6, 
    date: '2023-05-10', 
    merchant: 'Electric Bill', 
    amount: 85.63, 
    category: 'Utilities',
    logo: '/logos/electricity.png',
    iconFallback: Home
  },
];

// Prepare pie chart data using the consistent data
const pieChartData = {
  labels: [...SPENDING_DATA.categories.map(cat => cat.name), "Savings"],
  datasets: [
    {
      label: "Monthly Budget Allocation ($)",
      data: [...SPENDING_DATA.categories.map(cat => cat.budget), SPENDING_DATA.savings.budget],
      backgroundColor: [...SPENDING_DATA.categories.map(cat => cat.color), SPENDING_DATA.savings.color],
      borderColor: [...SPENDING_DATA.categories.map(cat => cat.color.replace('0.7', '1')), SPENDING_DATA.savings.color.replace('0.7', '1')],
      borderWidth: 1,
    },
  ],
};

// Bar chart data for monthly spending
const barChartData = {
  labels: SPENDING_DATA.categories.map(cat => cat.name),
  datasets: [
    {
      label: 'Budget',
      data: SPENDING_DATA.categories.map(cat => cat.budget),
      backgroundColor: 'rgba(46, 164, 79, 0.6)',
      borderColor: 'rgba(46, 164, 79, 1)',
      borderWidth: 1,
    },
    {
      label: 'Spent',
      data: SPENDING_DATA.categories.map(cat => cat.spent),
      backgroundColor: 'rgba(254, 161, 21, 0.6)',
      borderColor: 'rgba(254, 161, 21, 1)',
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

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
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
    title: {
      display: true,
      text: 'Budget vs. Spending by Category',
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

const mockInsights = {
  good_habits: [
    "You're consistently saving 17% of your income!",
    "Great job on limiting entertainment expenses this month."
  ],
  bad_habits: [
    "Consider reducing your dining out expenses.",
    "Watch out for frequent small purchases at convenience stores."
  ]
};

// Category details for when a category is selected
const getCategoryDetails = (index) => {
  if (index === null) return null;
  
  const categories = {
    0: { // Housing
      title: "Housing Breakdown",
      items: [
        { label: "Rent/Mortgage", amount: 1000 },
        { label: "Insurance", amount: 100 },
        { label: "Property Tax", amount: 50 },
      ]
    },
    1: { // Food
      title: "Food Breakdown",
      items: [
        { label: "Groceries", amount: 250 },
        { label: "Dining Out", amount: 100 },
      ]
    },
    2: { // Transportation
      title: "Transportation Breakdown",
      items: [
        { label: "Gas", amount: 150 },
        { label: "Public Transit", amount: 75 },
        { label: "Car Maintenance", amount: 50 },
      ]
    },
    3: { // Entertainment
      title: "Entertainment Breakdown",
      items: [
        { label: "Streaming Services", amount: 30 },
        { label: "Movies/Events", amount: 50 },
      ]
    },
    4: { // Utilities
      title: "Utilities Breakdown",
      items: [
        { label: "Electricity", amount: 90 },
        { label: "Water", amount: 40 },
        { label: "Internet", amount: 60 },
      ]
    },
    5: { // Education
      title: "Education Breakdown",
      items: [
        { label: "Tuition", amount: 200 },
        { label: "Books", amount: 50 },
        { label: "Online Courses", amount: 50 },
      ]
    },
    6: { // Savings
      title: "Savings Breakdown",
      items: [
        { label: "Emergency Fund", amount: 300 },
        { label: "Car Fund", amount: 150 },
        { label: "Vacation Fund", amount: 70 },
      ]
    },
  };
  
  return categories[index] || null;
};

export default function DashboardPage() {
  const [insights, setInsights] = useState(mockInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(pieChartData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const lastFetchRef = useRef(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentTransactions, setRecentTransactions] = useState(RECENT_TRANSACTIONS);

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
      setChartData(pieChartData); // Reset to original data
    } else {
      setSelectedCategory(index);
      
      // Make a copy of the chart data
      const newData = JSON.parse(JSON.stringify(pieChartData));
      
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

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">🌱</span>
        Your Financial Forest
      </h1>
      
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <div className="flex items-center">
              <BarChart size={16} className="mr-1" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'insights'
                ? 'text-green-600 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-green-500'
            }`}
          >
            <div className="flex items-center">
              <TrendingUp size={16} className="mr-1" />
              Insights
            </div>
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' ? (
        <>
          {/* Top Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card hover:border-green-200 flex flex-col">
              <p className="text-gray-600 text-xs mb-1">Monthly Income</p>
              <p className="text-xl font-semibold text-green-700">${SPENDING_DATA.total.income.toLocaleString()}</p>
              <div className="w-full h-1 bg-green-100 rounded mt-2">
                <div className="bg-green-500 h-1 rounded" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="card hover:border-green-200 flex flex-col">
              <p className="text-gray-600 text-xs mb-1">Total Spent</p>
              <p className="text-xl font-semibold text-amber-600">${SPENDING_DATA.categories.reduce((sum, cat) => sum + cat.spent, 0).toLocaleString()}</p>
              <div className="w-full h-1 bg-amber-100 rounded mt-2">
                <div className="bg-amber-500 h-1 rounded" style={{ width: `${(SPENDING_DATA.categories.reduce((sum, cat) => sum + cat.spent, 0) / SPENDING_DATA.total.budget) * 100}%` }}></div>
              </div>
            </div>
            <div className="card hover:border-green-200 flex flex-col">
              <p className="text-gray-600 text-xs mb-1">Savings</p>
              <p className="text-xl font-semibold text-blue-600">${SPENDING_DATA.savings.spent.toLocaleString()}</p>
              <div className="w-full h-1 bg-blue-100 rounded mt-2">
                <div className="bg-blue-500 h-1 rounded" style={{ width: `${(SPENDING_DATA.savings.spent / SPENDING_DATA.savings.budget) * 100}%` }}></div>
              </div>
            </div>
            <div className="card hover:border-green-200 flex flex-col">
              <p className="text-gray-600 text-xs mb-1">Remaining</p>
              <p className="text-xl font-semibold text-green-700">${(SPENDING_DATA.total.income - SPENDING_DATA.categories.reduce((sum, cat) => sum + cat.spent, 0)).toLocaleString()}</p>
              <div className="w-full h-1 bg-green-100 rounded mt-2">
                <div className="bg-green-500 h-1 rounded" style={{ width: `${((SPENDING_DATA.total.income - SPENDING_DATA.categories.reduce((sum, cat) => sum + cat.spent, 0)) / SPENDING_DATA.total.income) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Financial Growth Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card hover:border-green-200 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
              <div className="absolute -left-8 -bottom-8 w-20 h-20 bg-green-50 rounded-full opacity-50"></div>
              
              <h2 className="text-xl font-semibold text-green-800 mb-3 relative z-10">Financial Growth</h2>
              <div className="p-4 bg-gradient-to-b from-green-50 to-transparent rounded-lg relative z-10">
                <div className="h-48 flex justify-center">
                  <Tree progress={SPENDING_DATA.savings.progress} />
                </div>
              </div>
              <p className="text-center text-sm text-green-600 mt-2 relative z-10">
                Your financial health is at {SPENDING_DATA.savings.progress}% of your goals
              </p>
            </div>
            
            <div className="card hover:border-green-200 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-20 h-20 bg-amber-50 rounded-full opacity-50"></div>
              <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-amber-50 rounded-full opacity-50"></div>
              
              <h2 className="text-xl font-semibold text-green-800 mb-3 relative z-10">Savings Progress</h2>
              <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-lg p-5 mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-700 font-medium">Current: ${SPENDING_DATA.savings.spent}</span>
                  <span className="text-amber-700 font-medium">Goal: ${SPENDING_DATA.savings.budget}</span>
                </div>
                <div className="w-full bg-white h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-700"
                    style={{ width: `${SPENDING_DATA.savings.progress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 font-medium text-green-700">{SPENDING_DATA.savings.progress}% Complete</p>
                
                <div className="mt-6 flex justify-between">
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block mb-1">Monthly Income</span>
                    <span className="text-lg font-bold text-green-700">${SPENDING_DATA.total.income}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block mb-1">Monthly Expenses</span>
                    <span className="text-lg font-bold text-red-600">${SPENDING_DATA.categories.reduce((sum, cat) => sum + cat.spent, 0)}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block mb-1">Savings Rate</span>
                    <span className="text-lg font-bold text-green-700">17%</span>
                  </div>
                </div>
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
                    {pieChartData.labels[selectedCategory]} Details
                  </h2>
                  <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-bold text-green-700">
                      ${selectedCategory < pieChartData.labels.length - 1 
                        ? SPENDING_DATA.categories[selectedCategory].budget 
                        : SPENDING_DATA.savings.budget}
                    </span>
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
                      <p className="text-xl font-bold">${SPENDING_DATA.total.budget.toLocaleString()}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="font-medium text-amber-700">Largest Expense:</p>
                      <p className="text-xl font-bold">Housing</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-blue-700">Smallest Expense:</p>
                      <p className="text-xl font-bold">Entertainment</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Insights Tab Content */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="card hover:border-green-200 md:col-span-2 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-50 rounded-full opacity-30"></div>
            
            <h2 className="text-xl font-semibold text-green-800 mb-4 relative z-10">Budget vs. Spending</h2>
            <div className="h-[350px] relative z-10">
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>
          
          {/* Insights */}
          <div className="space-y-6">
            {/* Financial Habits */}
            <div className="card hover:border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Your Financial Habits</h2>
              
              <div>
                <h3 className="text-green-700 font-medium flex items-center mb-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <CheckCircle2 size={14} className="text-green-700" />
                  </div>
                  Good Habits
                </h3>
                <ul className="space-y-2 mb-4">
                  {insights.good_habits.map((habit, index) => (
                    <li key={index} className="ml-8 text-sm text-gray-700 relative before:content-['•'] before:absolute before:-left-4 before:text-green-500">
                      {habit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-amber-700 font-medium flex items-center mb-2">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                    <AlertCircle size={14} className="text-amber-700" />
                  </div>
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {insights.bad_habits.map((habit, index) => (
                    <li key={index} className="ml-8 text-sm text-gray-700 relative before:content-['•'] before:absolute before:-left-4 before:text-amber-500">
                      {habit}
                    </li>
                  ))}
                </ul>
              </div>

              {loading && (
                <div className="text-center py-2 text-sm text-gray-500">
                  Updating insights...
                </div>
              )}
              
              {error && (
                <div className="text-center py-2 text-sm text-red-500">
                  {error}
                </div>
              )}
            </div>
            
            {/* Spending Trends */}
            <div className="card hover:border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Spending Trends</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Food</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingDown size={14} className="mr-1" /> 12% from last month
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Entertainment</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <TrendingDown size={14} className="mr-1" /> 8% from last month
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Housing</span>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MinusIcon size={14} className="mr-1" /> No change
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transportation</span>
                  <div className="flex items-center text-amber-600 text-sm">
                    <TrendingUp size={14} className="mr-1" /> 5% from last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-lg shadow-md border border-green-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-green-50 border-b border-green-100">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Merchant</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-green-50/30">
                    <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          {transaction.iconFallback && (
                            <transaction.iconFallback size={16} className="text-green-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{transaction.merchant}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{transaction.category}</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-gray-800">${transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-3 px-4 bg-gray-50 border-t border-gray-100">
            <Link 
              href="/main/transactions" 
              className="text-sm text-green-600 font-medium flex items-center hover:text-green-700"
            >
              View all transactions
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}