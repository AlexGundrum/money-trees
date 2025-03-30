'use client';

import Link from 'next/link';

export default function EducationPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Financial Education</h1>
        <Link 
          href="/main/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Common Rookie Mistakes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Common Rookie Mistakes</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <div>
                <p className="font-medium">Impulse Spending</p>
                <p className="text-gray-600">Making unplanned purchases without considering your budget</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <div>
                <p className="font-medium">Ignoring Emergency Fund</p>
                <p className="text-gray-600">Not setting aside money for unexpected expenses</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <div>
                <p className="font-medium">Credit Card Debt</p>
                <p className="text-gray-600">Carrying balances and paying high interest rates</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Smart Saving Tips */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-600">Smart Saving Tips</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <p className="font-medium">Pay Yourself First</p>
                <p className="text-gray-600">Set aside savings before spending on other things</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <p className="font-medium">Track Your Spending</p>
                <p className="text-gray-600">Keep a record of all expenses to identify patterns</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <p className="font-medium">Set Specific Goals</p>
                <p className="text-gray-600">Have clear, measurable savings targets</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Helpful Resources</h2>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Budgeting Templates
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Student Loan Calculator
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Financial Planning Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 