"use client";

import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Default spending categories and limits
const defaultLabels = ["Housing", "Food", "Transportation", "Entertainment", "Utilities", "Education"];
const defaultData = [1200, 450, 300, 150, 200, 300];
const defaultLimits = [2000, 1000, 500, 500, 500, 1000]; // Max limits for each category

export default function AdjustablePieChart() {
  const [values, setValues] = useState(defaultData);
  const [limits, setLimits] = useState(defaultLimits);
  const [income, setIncome] = useState(3000); // Default income value

  // Calculate total expenses
  const totalExpenses = values.reduce((acc, curr) => acc + curr, 0);
  const savings = income - totalExpenses; // Calculate savings

  // Handle slider adjustments
  const handleSliderChange = (index, newValue) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = Math.min(newValue, limits[index]); // Ensure value stays within limit
      return newValues;
    });
  };

  // Handle limit changes via input field
  const handleLimitChange = (index, newLimit) => {
    setLimits((prevLimits) => {
      const newLimits = [...prevLimits];
      newLimits[index] = Number(newLimit) || 0; // Ensure it's a number
      return newLimits;
    });
  };

  return (
    <div className="flex flex-row items-start justify-center space-x-6 p-4">
      {/* Pie Chart & Summary */}
      <div className="w-1/2 max-w-md">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Monthly Spending</h2>
        <Pie
          data={{
            labels: defaultLabels,
            datasets: [
              {
                label: "Spending ($)",
                data: values,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                  "rgba(255, 159, 64, 0.7)",
                ],
                borderWidth: 1,
              },
            ],
          }}
        />

        {/* Summary Box */}
        <div className="mt-4 p-3 bg-gray-50 border rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Financial Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Income:</span>
            <span>${income}</span>
          </div>
          <div className="flex justify-between text-sm text-red-500">
            <span className="font-medium">Expenses:</span>
            <span>-${totalExpenses}</span>
          </div>
          <div className={`flex justify-between text-sm font-medium ${savings >= 0 ? "text-green-500" : "text-red-500"}`}>
            <span>Savings:</span>
            <span>${savings}</span>
          </div>

          {/* Income Input */}
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <label className="text-gray-600">Set Income:</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="border p-1 w-24 text-center rounded"
            />
          </div>
        </div>
      </div>

      {/* Sliders & Limit Inputs */}
      <div className="w-1/2 flex flex-col space-y-2 pr-5">
        <h3 className="text-lg font-semibold mb-1">Adjust Spending</h3>
        {defaultLabels.map((label, index) => (
          <div key={index} className="flex flex-col p-2 border rounded shadow-sm bg-gray-50">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span>${values[index]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={limits[index]}
              value={values[index]}
              onChange={(e) => handleSliderChange(index, Number(e.target.value))}
              className="w-full h-1 mt-2 accent-blue-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span>Max: ${limits[index]}</span>
            </div>

            {/* Input to change max limit */}
            <div className="mt-1 flex items-center space-x-2">
              <label className="text-xs text-gray-600">Limit: </label>
              <input
                type="number"
                value={limits[index]}
                onChange={(e) => handleLimitChange(index, e.target.value)}
                className="border p-1 w-16 text-center text-xs rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
