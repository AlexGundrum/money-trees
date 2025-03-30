"use client"; // Required for client-side components in Next.js

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
// Import the fetchTransactions function (uncomment when API is ready)
// import { fetchTransactions } from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

// Sample financial data - this would ideally come from your API
const defaultData = {
  labels: ["Housing", "Food", "Transportation", "Entertainment", "Utilities", "Education"],
  datasets: [
    {
      label: "Monthly Spending ($)",
      data: [1200, 450, 300, 150, 200, 300],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function PieChart() {
  const [data, setData] = useState(defaultData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Feature to fetch actual data from API (uncomment when API is ready)
  /*
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current month and year for filtering
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // Months are 0-indexed
        const currentYear = now.getFullYear();
        
        // Fetch transactions for current month
        const transactions = await fetchTransactions({
          filters: {
            month: currentMonth,
            year: currentYear
          }
        });

        // Process data - group by category and sum amounts
        const categoryData = transactions.reduce((acc, transaction) => {
          // Only count expenses, not income
          if (!transaction.is_income) {
            const category = transaction.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
          }
          return acc;
        }, {});

        // Prepare data for Chart.js
        const labels = Object.keys(categoryData);
        const dataValues = Object.values(categoryData);

        // Generate colors based on the number of categories
        const backgroundColors = labels.map((_, index) => 
          `hsl(${(index * 360) / labels.length}, 70%, 70%)`
        );
        const borderColors = labels.map((_, index) => 
          `hsl(${(index * 360) / labels.length}, 70%, 50%)`
        );

        // Update the chart data
        setData({
          labels,
          datasets: [
            {
              label: "Monthly Spending ($)",
              data: dataValues,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch spending data:", error);
        // Fallback to default data if API fails
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  */

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: {
            size: 12
          }
        },
        onClick: (e, legendItem, legend) => {
          // Toggle category selection
          const index = legendItem.index;
          setSelectedCategory(selectedCategory === index ? null : index);
          
          // Standard legend click behavior (show/hide)
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(0);
          meta.data[index].hidden = !meta.data[index].hidden;
          ci.update();
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
      }
    }
  };

  // Handle category click
  const handleCategoryDetails = (index) => {
    if (index === null) return;
    
    const categoryBreakdowns = {
      0: { // Housing
        details: [
          { name: "Rent/Mortgage", amount: 1000 },
          { name: "Insurance", amount: 100 },
          { name: "Property Tax", amount: 100 },
        ]
      },
      1: { // Food
        details: [
          { name: "Groceries", amount: 300 },
          { name: "Dining Out", amount: 150 },
        ]
      },
      // Could add more breakdowns for other categories
    };
    
    // This could show a modal or update a different component
    console.log("Category details:", categoryBreakdowns[index] || "No detailed breakdown available");
  };

  // Watch for changes in selected category
  useEffect(() => {
    if (selectedCategory !== null) {
      handleCategoryDetails(selectedCategory);
    }
  }, [selectedCategory]);

  // Highlight selected segment
  const getDatasetWithHighlight = () => {
    if (selectedCategory === null) return data.datasets;
    
    const newBackgroundColors = [...data.datasets[0].backgroundColor];
    const newBorderColors = [...data.datasets[0].borderColor];
    
    // Make non-selected segments more transparent
    for (let i = 0; i < newBackgroundColors.length; i++) {
      if (i !== selectedCategory) {
        newBackgroundColors[i] = newBackgroundColors[i].replace("0.7", "0.3");
      } else {
        // Make selected segment stand out
        newBorderColors[i] = "rgba(0, 0, 0, 1)";
      }
    }
    
    return [{
      ...data.datasets[0],
      backgroundColor: newBackgroundColors,
      borderColor: newBorderColors,
      borderWidth: data.datasets[0].borderWidth,
    }];
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Spending Breakdown</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading spending data...</p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <Pie 
            data={{
              ...data,
              datasets: getDatasetWithHighlight(),
            }} 
            options={options} 
          />
          {selectedCategory !== null && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h3 className="font-medium text-gray-800">
                {data.labels[selectedCategory]} Details
              </h3>
              <p className="text-gray-600 mt-1">
                Total: ${data.datasets[0].data[selectedCategory]}
              </p>
              <button 
                className="mt-2 text-blue-600 text-sm hover:underline"
                onClick={() => setSelectedCategory(null)}
              >
                Close Details
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}