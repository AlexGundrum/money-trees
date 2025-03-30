// frontend/app/(main)/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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

// Mock chart data
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data: [2000, 2500, 2200, 2800, 2400, 2600],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      tension: 0.4,
    },
    {
      label: 'Expenses',
      data: [1800, 2200, 2000, 2400, 2100, 2300],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Income vs Expenses',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '$' + value;
        }
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

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call once backend is ready
        // const response = await fetch('http://localhost:5001/api/openai-insights');
        // const data = await response.json();
        // setInsights(data);
      } catch (err) {
        setError('Failed to fetch insights');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="h-[400px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Good Habits</h2>
          <ul className="space-y-2">
            {insights.good_habits.map((habit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {habit}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Areas for Improvement</h2>
          <ul className="space-y-2">
            {insights.bad_habits.map((habit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">!</span>
                {habit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}