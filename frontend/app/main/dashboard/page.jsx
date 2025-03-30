// frontend/app/(main)/dashboard/page.jsx
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

// Mock spending data for pie chart
const spendingData = {
  labels: ["Housing", "Food", "Transportation", "Entertainment", "Utilities", "Education", "Savings"],
  datasets: [
    {
      label: "Monthly Spending ($)",
      data: [1200, 450, 300, 150, 200, 300, 520],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
        "rgba(75, 192, 192, 0.7)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(75, 192, 192, 1)",
      ],
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
          size: 12
        }
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
      }
    },
    title: {
      display: true,
      text: 'Monthly Spending Breakdown',
      font: {
        size: 16,
      }
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
        {
          "name": "Housing",
          "total": 1200,
          "subcategories": [
            {"name": "Rent/Mortgage", "amount": 1000},
            {"name": "Insurance", "amount": 100},
            {"name": "Property Tax", "amount": 100}
          ]
        },
        {
          "name": "Food",
          "total": 450,
          "subcategories": [
            {"name": "Groceries", "amount": 300},
            {"name": "Dining Out", "amount": 150}
          ]
        },
        {
          "name": "Transportation",
          "total": 300,
          "subcategories": [
            {"name": "Gas", "amount": 150},
            {"name": "Public Transit", "amount": 100},
            {"name": "Car Maintenance", "amount": 50}
          ]
        },
        {
          "name": "Entertainment",
          "total": 150,
          "subcategories": [
            {"name": "Streaming Services", "amount": 50},
            {"name": "Movies/Events", "amount": 70},
            {"name": "Hobbies", "amount": 30}
          ]
        },
        {
          "name": "Utilities",
          "total": 200,
          "subcategories": [
            {"name": "Electricity", "amount": 80},
            {"name": "Water", "amount": 40},
            {"name": "Internet", "amount": 60},
            {"name": "Phone", "amount": 20}
          ]
        },
        {
          "name": "Education",
          "total": 300,
          "subcategories": [
            {"name": "Tuition", "amount": 200},
            {"name": "Books", "amount": 50},
            {"name": "Online Courses", "amount": 50}
          ]
        }
      ],
      "analysis_goals": [
        "Identify spending patterns",
        "Highlight potential savings opportunities",
        "Provide personalized recommendations",
        "Point out good financial habits",
        "Suggest areas for improvement"
      ],
      "user_context": {
        "financial_goals": "Not specified",  // You could add actual user goals here
        "income_range": "Not specified",    // Would be helpful for better analysis
        "savings_rate": "20%"               // From your mock insights
      }
    }
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
          { label: "Property Tax", amount: 100 },
        ]
      },
      1: { // Food
        title: "Food Breakdown",
        items: [
          { label: "Groceries", amount: 300 },
          { label: "Dining Out", amount: 150 },
        ]
      },
      2: { // Transportation
        title: "Transportation Breakdown",
        items: [
          { label: "Gas", amount: 150 },
          { label: "Public Transit", amount: 100 },
          { label: "Car Maintenance", amount: 50 },
        ]
      },
      3: { // Entertainment
        title: "Entertainment Breakdown",
        items: [
          { label: "Streaming Services", amount: 50 },
          { label: "Movies/Events", amount: 70 },
          { label: "Hobbies", amount: 30 },
        ]
      },
      4: { // Utilities
        title: "Utilities Breakdown",
        items: [
          { label: "Electricity", amount: 80 },
          { label: "Water", amount: 40 },
          { label: "Internet", amount: 60 },
          { label: "Phone", amount: 20 },
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
    };
    
    return categories[index] || null;
  };

  spendingData.datasets[0].data


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Chart and Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <div className="h-[400px] relative">
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
        </div>

        {/* Category Details or Tips */}
        <div className="bg-white p-6 rounded-lg shadow">
          {selectedCategory !== null ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {spendingData.labels[selectedCategory]} Details
              </h2>
              <p className="text-gray-600 mb-4">
                Total: ${spendingData.datasets[0].data[selectedCategory]}
              </p>
              
              {getCategoryDetails(selectedCategory) && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">
                    {getCategoryDetails(selectedCategory).title}
                  </h3>
                  <ul className="space-y-2">
                    {getCategoryDetails(selectedCategory).items.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.label}</span>
                        <span className="font-medium">${item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button 
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => handleCategorySelect(selectedCategory)}
              >
                Reset Selection
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Spending Insights</h2>
              <p className="text-gray-600 mb-4">
                Click on a category in the chart to see a detailed breakdown.
              </p>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium block">Monthly Total:</span> 
                  ${spendingData.datasets[0].data.reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium block">Largest Expense:</span>
                  {spendingData.labels[
                    spendingData.datasets[0].data.indexOf(
                      Math.max(...spendingData.datasets[0].data)
                    )
                  ]}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Good Habits</h2>
          {loading ? (
            <div className="text-gray-500">Loading insights...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul className="space-y-2">
              {insights.good_habits.map((habit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {habit}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Areas for Improvement</h2>
          {loading ? (
            <div className="text-gray-500">Loading insights...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul className="space-y-2">
              {insights.bad_habits.map((habit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">!</span>
                  {habit}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Monthly Income</p>
            <p className="text-2xl font-bold text-green-600">${llm_data.financial_analysis_request.total_spending + 520}</p>
          </div>
          <div>
            <p className="text-gray-600">Monthly Expenses</p>
            <p className="text-2xl font-bold text-red-600">${llm_data.financial_analysis_request.total_spending}</p>
          </div>
          <div>
            <p className="text-gray-600">Monthly Savings</p>
            <p className="text-2xl font-bold text-blue-600">$520</p>
          </div>
          <div>
            <p className="text-gray-600">Savings Rate</p>
            <p className="text-2xl font-bold text-blue-600">20%</p>
          </div>
        </div>
      </div>
    </div>
  );
}