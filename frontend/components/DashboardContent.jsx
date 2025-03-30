// frontend/components/DashboardContent.jsx
"use client";

import React, { useState, useEffect } from 'react';

// Define the Flask API endpoint URL - **MUST MATCH ALEX'S SETUP**
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'; // Use environment variable or default
const INSIGHTS_ENDPOINT = `${API_URL}/api/openai-insights`;

const DashboardContent = () => {
  // Initialize state with expected structure
  const [insights, setInsights] = useState({ good_habits: [], bad_habits: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // No type needed

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching insights from: ${INSIGHTS_ENDPOINT}`); // Log the URL being fetched

      try {
        // Fetch from the EXTERNAL Flask API endpoint
        const response = await fetch(INSIGHTS_ENDPOINT);

        if (!response.ok) {
          let errorText = `HTTP error! status: ${response.status}`;
          try {
             // Try to get more specific error from Flask response body
             const errorData = await response.json();
             errorText = errorData.error || errorData.message || errorText;
          } catch (parseError) {
             // If response isn't JSON or empty, use the status text
             errorText = `${errorText} - ${response.statusText}`;
          }
          throw new Error(errorText);
        }

        const data = await response.json(); // No type needed for data
        setInsights(data);

      } catch (e) { // No type needed for error 'e'
        console.error("Failed to fetch insights:", e);
        setError(e.message || "Could not load AI insights. Please try again later.");
        // Set placeholder on error
        setInsights({ good_habits: ["Error loading data"], bad_habits: ["Error loading data"] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []); // Empty dependency array means run once on mount

  return (
    <div className="flex flex-col md:flex-row md:space-x-8">
      {/* Left Column */}
      <div className="md:w-2/3">
        <div className="bg-white rounded-2xl shadow-md p-6 min-h-[24rem] flex items-center justify-center">
          <p className="text-gray-400 text-lg">Spending Overview Chart (Placeholder)</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:w-1/3 mt-6 md:mt-0">
        <div className="bg-blue-50 rounded-2xl shadow-md p-6 min-h-[24rem]">
          <h2 className="text-blue-800 text-xl font-semibold mb-4">AI Spending Insights</h2>

          {isLoading && <p className="text-gray-500">Loading insights...</p>}

          {error && <p className="text-red-600">Error: {error}</p>}

          {!isLoading && !error && (
            <>
              <div className="mb-6">
                <h3 className="text-teal-700 font-medium mb-2">What You're Doing Well 👍</h3>
                <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                  {insights.good_habits && insights.good_habits.length > 0 ? (
                    insights.good_habits.map((habit, index) => <li key={`good-${index}`}>{habit}</li>)
                  ) : (
                    <li>No specific good habits identified yet.</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-gray-700 font-medium mb-2">Areas to Improve 🤔</h3>
                <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                   {insights.bad_habits && insights.bad_habits.length > 0 ? (
                    insights.bad_habits.map((habit, index) => <li key={`bad-${index}`}>{habit}</li>)
                  ) : (
                    <li>No specific areas for improvement identified yet.</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;