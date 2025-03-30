"use client";

import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Default spending data
const defaultLabels = ["Housing", "Food", "Transportation", "Entertainment", "Utilities", "Education"];
const defaultData = [1200, 450, 300, 150, 200, 300];
const defaultLimits = [2000, 1000, 500, 500, 500, 1000]; // Max limits for each category

export default function AdjustablePieChart() {
  const [values, setValues] = useState(defaultData);
  const [limits, setLimits] = useState(defaultLimits);

  // Handle slider adjustments
  const handleSliderChange = (index, newValue) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = Math.min(newValue, limits[index]); // Ensure it doesn't exceed limit
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
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Adjustable Monthly Spending</h2>
      
      {/* Pie Chart */}
      <div className="w-full max-w-md">
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
      </div>

      {/* Sliders & Input Fields for Limits */}
      <div className="mt-4 w-full max-w-md space-y-3">
        {defaultLabels.map((label, index) => (
          <div key={index} className="flex flex-col p-2 border rounded">
            <div className="flex justify-between">
              <span className="font-medium">{label}</span>
              <span>${values[index]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={limits[index]}
              value={values[index]}
              onChange={(e) => handleSliderChange(index, Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>0</span>
              <span>Max: ${limits[index]}</span>
            </div>

            {/* Input to change max limit */}
            <div className="mt-2 flex items-center space-x-2">
              <label className="text-sm text-gray-600">Limit: </label>
              <input
                type="number"
                value={limits[index]}
                onChange={(e) => handleLimitChange(index, e.target.value)}
                className="border p-1 w-20 text-center rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
