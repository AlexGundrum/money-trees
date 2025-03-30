'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, ArrowRight, ChevronRight, PieChart, Zap } from 'lucide-react';
import { Pie } from 'react-chartjs-2';

// Using the same income data as throughout the app (from the dashboard)
const MONTHLY_INCOME = 3120;
const MONTHLY_EXPENSES = 2600; // Based on spending categories total
const MONTHLY_SAVINGS = 520; // To match existing data

export default function WhatIfPage() {
  const [income, setIncome] = useState(MONTHLY_INCOME);
  const [scenario, setScenario] = useState({
    name: 'New Monthly Expense',
    amount: '300',
    recurring: 'monthly',
    duration: 12,
    isIncome: false
  });
  const [resultSteps, setResultSteps] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [chartData, setChartData] = useState(null);

  const recurringOptions = [
    { value: 'once', label: 'One-time' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const durationOptions = [
    { value: 1, label: '1 month' },
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '1 year' },
    { value: 24, label: '2 years' },
    { value: 60, label: '5 years' }
  ];

  // Standard scenarios the user can quickly select
  const quickScenarios = [
    { name: 'New Car', amount: 300, recurring: 'monthly', duration: 60, isIncome: false },
    { name: 'Vacation', amount: 1500, recurring: 'once', duration: 1, isIncome: false },
    { name: 'Housing Upgrade', amount: 500, recurring: 'monthly', duration: 12, isIncome: false },
    { name: '10% Raise', amount: MONTHLY_INCOME * 0.1, recurring: 'monthly', duration: 12, isIncome: true }
  ];

  // Prepare chart data based on calculation
  useEffect(() => {
    if (showResults && resultSteps.length > 0) {
      const monthlyScenarioImpact = parseFloat(
        resultSteps.find(step => step.step === 'Monthly Impact')?.rawAmount || 0
      );

      // Create chart data
      const scenarioAmount = parseFloat(scenario.amount) || 0;
      const isIncome = !!scenario.isIncome;
      
      // Format for monthly perspective
      let chartAmount;
      if (scenario.recurring === 'once') {
        chartAmount = scenarioAmount / scenario.duration;
      } else if (scenario.recurring === 'monthly') {
        chartAmount = scenarioAmount;
      } else if (scenario.recurring === 'yearly') {
        chartAmount = scenarioAmount / 12;
      }

      // Prepare data for the pie chart
      if (isIncome) {
        setChartData({
          labels: ['Current Expenses', 'Current Savings', 'Additional Income'],
          datasets: [
            {
              data: [MONTHLY_EXPENSES, MONTHLY_SAVINGS, chartAmount],
              backgroundColor: [
                'rgba(254, 161, 21, 0.7)', // Orange for expenses
                'rgba(46, 164, 79, 0.7)',  // Green for savings
                'rgba(56, 148, 198, 0.7)'  // Blue for new income
              ],
              borderColor: [
                'rgba(254, 161, 21, 1)',
                'rgba(46, 164, 79, 1)',
                'rgba(56, 148, 198, 1)'
              ],
              borderWidth: 1,
            },
          ],
        });
      } else {
        // For expenses, show how it affects the budget
        const newExpenses = MONTHLY_EXPENSES + chartAmount;
        const newSavings = Math.max(0, MONTHLY_INCOME - newExpenses);
        
        setChartData({
          labels: ['Current Expenses', 'New Expense', 'Remaining Savings'],
          datasets: [
            {
              data: [MONTHLY_EXPENSES, chartAmount, newSavings],
              backgroundColor: [
                'rgba(254, 161, 21, 0.7)', // Orange for current expenses
                'rgba(209, 73, 91, 0.7)',  // Red for new expense
                'rgba(46, 164, 79, 0.7)'   // Green for remaining savings
              ],
              borderColor: [
                'rgba(254, 161, 21, 1)',
                'rgba(209, 73, 91, 1)',
                'rgba(46, 164, 79, 1)'
              ],
              borderWidth: 1,
            },
          ],
        });
      }
    }
  }, [showResults, resultSteps, scenario]);

  // Select a quick scenario
  const selectQuickScenario = (quickScenario) => {
    setScenario({
      ...quickScenario,
      amount: quickScenario.amount.toString()
    });
    calculateImpact({
      ...quickScenario,
      amount: quickScenario.amount
    });
  };

  // Calculate financial impact of the scenario
  const calculateImpact = (data = scenario) => {
    const scenarioAmount = parseFloat(data.amount) || 0;
    
    if (scenarioAmount <= 0) {
      setResultSteps([{
        step: 'Invalid amount',
        description: 'Please enter a positive amount for your scenario.'
      }]);
      setShowResults(true);
      return;
    }

    // Convert the scenario to monthly impact
    let monthlyImpact = 0;
    if (data.recurring === 'once') {
      monthlyImpact = scenarioAmount / data.duration;
    } else if (data.recurring === 'monthly') {
      monthlyImpact = scenarioAmount;
    } else if (data.recurring === 'yearly') {
      monthlyImpact = scenarioAmount / 12;
    }

    // If this is an expense (not income), validate it's affordable
    let isAffordable = true;
    if (!data.isIncome && monthlyImpact > income) {
      isAffordable = false;
      setResultSteps([{
        step: 'Exceeds monthly income',
        description: `This expense of $${monthlyImpact.toFixed(2)} per month exceeds your current monthly income of $${income.toFixed(2)}.`,
        rawAmount: monthlyImpact
      }]);
      setShowResults(true);
      return;
    }

    // Calculate scenario impact
    const steps = [];
    const sign = data.isIncome ? 1 : -1;
    const totalImpact = data.recurring === 'once' ? scenarioAmount : scenarioAmount * (data.recurring === 'monthly' ? data.duration : data.duration / 12);
    
    steps.push({
      step: 'Monthly Impact',
      description: `${data.isIncome ? 'Adding' : 'Subtracting'} $${monthlyImpact.toFixed(2)} ${data.recurring === 'once' ? 'averaged over time' : 'each month'}.`,
      rawAmount: monthlyImpact
    });

    steps.push({
      step: 'Total Impact',
      description: `Total ${data.isIncome ? 'income' : 'cost'} of $${totalImpact.toFixed(2)} over ${data.duration} month${data.duration > 1 ? 's' : ''}.`
    });

    const percentOfIncome = (monthlyImpact / income) * 100;
    steps.push({
      step: 'Budget Impact',
      description: `This ${data.isIncome ? 'increases your income' : 'represents'} by ${percentOfIncome.toFixed(1)}% of your current monthly income.`
    });

    // Add savings impact (if expense)
    if (!data.isIncome) {
      const currentSavingsRate = MONTHLY_SAVINGS; // From the consistent data
      const newSavingsRate = currentSavingsRate - monthlyImpact;
      
      if (newSavingsRate < 0) {
        steps.push({
          step: 'Savings Impact',
          description: `This would exceed your current savings rate of $${currentSavingsRate} per month by $${Math.abs(newSavingsRate).toFixed(2)}.`,
          affectsSavings: true,
          newSavingsRate
        });
      } else {
        steps.push({
          step: 'Savings Impact',
          description: `This would reduce your monthly savings from $${currentSavingsRate.toFixed(2)} to $${newSavingsRate.toFixed(2)}.`,
          affectsSavings: true,
          newSavingsRate
        });
      }
    } else {
      // If income, calculate additional savings
      const additionalSavings = monthlyImpact;
      const newSavingsRate = MONTHLY_SAVINGS + additionalSavings;
      
      steps.push({
        step: 'Savings Opportunity',
        description: `This could increase your monthly savings from $${MONTHLY_SAVINGS.toFixed(2)} to $${newSavingsRate.toFixed(2)}.`,
        affectsSavings: true,
        newSavingsRate
      });
    }

    // Add long-term impact for perspective
    const yearAmount = data.recurring === 'once' 
      ? scenarioAmount 
      : (data.recurring === 'monthly' ? scenarioAmount * 12 : scenarioAmount);
      
    steps.push({
      step: 'Annual Perspective',
      description: `Over a year, this ${data.isIncome ? 'adds' : 'costs'} $${yearAmount.toFixed(2)}.`
    });

    setResultSteps(steps);
    setShowResults(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateImpact();
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          font: {
            size: 12
          },
          padding: 15
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
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">🔮</span>
        Financial What-If Simulator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <Calculator size={20} className="text-green-600 mr-2" />
              Create Scenario
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scenarioName" className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Name
                  </label>
                  <input 
                    type="text" 
                    id="scenarioName" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., New Car Payment, Vacation, etc."
                    value={scenario.name}
                    onChange={(e) => setScenario({...scenario, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="scenarioAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      id="scenarioAmount" 
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="0.00"
                      value={scenario.amount}
                      onChange={(e) => setScenario({...scenario, amount: e.target.value})}
                      required
                      step="0.01"
                      min="0"
                      max={scenario.isIncome ? undefined : income * 10} // Limit expenses
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-green-800 mb-3">Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      !scenario.isIncome 
                        ? 'border-green-400 bg-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => setScenario({...scenario, isIncome: false})}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="type"
                      checked={!scenario.isIncome}
                      onChange={() => {}}
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                        <DollarSign size={20} className="text-amber-600" />
                      </div>
                      <span className="font-medium text-sm">Expense</span>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        What if I spend money?
                      </p>
                    </div>
                    {!scenario.isIncome && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div 
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      scenario.isIncome 
                        ? 'border-green-400 bg-white shadow-sm' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => setScenario({...scenario, isIncome: true})}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name="type"
                      checked={scenario.isIncome}
                      onChange={() => {}}
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <DollarSign size={20} className="text-green-600" />
                      </div>
                      <span className="font-medium text-sm">Income</span>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        What if I earn money?
                      </p>
                    </div>
                    {scenario.isIncome && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="recurring" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <div className="relative">
                    <select
                      id="recurring"
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md appearance-none focus:ring-green-500 focus:border-green-500"
                      value={scenario.recurring}
                      onChange={(e) => setScenario({...scenario, recurring: e.target.value})}
                      required
                    >
                      {recurringOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      id="duration"
                      className="w-full p-2 pl-10 border border-gray-300 rounded-md appearance-none focus:ring-green-500 focus:border-green-500"
                      value={scenario.duration}
                      onChange={(e) => setScenario({...scenario, duration: parseInt(e.target.value)})}
                      required
                    >
                      {durationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button 
                  type="submit" 
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Zap size={18} />
                  Calculate Financial Impact
                </button>
              </div>
            </form>
          </div>

          {/* Quick Scenarios */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center">
              <Zap size={16} className="text-green-600 mr-2" />
              Quick Scenarios
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickScenarios.map((quick, index) => (
                <button
                  key={index}
                  onClick={() => selectQuickScenario(quick)}
                  className="p-3 border border-green-100 rounded-lg bg-white hover:bg-green-50 hover:border-green-200 text-center transition-all shadow-sm hover:shadow"
                >
                  <span className="block text-green-800 font-medium mb-1">{quick.name}</span>
                  <div className="flex justify-center items-center">
                    <span className={`text-sm px-2 py-0.5 rounded-full ${quick.isIncome ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      ${quick.amount}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {quick.recurring === 'once' ? 'once' : 
                       quick.recurring === 'monthly' ? '/mo' : '/yr'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-1">
          <div className="card hover:border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <TrendingUp size={20} className="text-green-600 mr-2" />
              Scenario Results
            </h2>
            
            {showResults ? (
              <div className="space-y-6">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-1">{scenario.name} Impact</h3>
                  <p className="text-sm text-gray-600">
                    {scenario.isIncome ? 'Income' : 'Expense'} of ${parseFloat(scenario.amount).toFixed(2)} 
                    {scenario.recurring === 'once' ? ' one-time' : ` per ${scenario.recurring}`} 
                    for {scenario.duration} {scenario.duration === 1 ? 'month' : 'months'}
                  </p>
                </div>
                
                {/* Chart visualization */}
                {chartData && resultSteps.length > 1 && (
                  <div className="bg-white p-2 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-green-800 mb-2 text-center text-sm">Financial Impact Visualization</h3>
                    <div className="h-44">
                      <Pie data={chartData} options={pieOptions} />
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {resultSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        step.affectsSavings && step.newSavingsRate < 0 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">{step.step}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-3 text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                    resultSteps.length === 1 || resultSteps.some(s => s.affectsSavings && s.newSavingsRate < 0)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {resultSteps.length === 1 || resultSteps.some(s => s.affectsSavings && s.newSavingsRate < 0)
                      ? 'Not Recommended'
                      : 'Financially Viable'}
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-2">
                    Based on your monthly income of ${income.toFixed(2)}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <PieChart size={24} className="text-green-600" />
                </div>
                <h3 className="text-green-800 font-medium">No Scenario Yet</h3>
                <p className="text-sm text-gray-600">Create a financial scenario to see its impact on your budget.</p>
                <div className="flex justify-center mt-2">
                  <ArrowRight size={20} className="text-green-400" />
                </div>
              </div>
            )}
          </div>
          
          {/* Income Information */}
          <div className="card hover:border-green-200 mt-6">
            <h3 className="font-medium text-green-800 mb-3">Your Current Financial Status</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                <span className="text-sm text-gray-600">Monthly Income:</span>
                <span className="font-medium text-green-700">${MONTHLY_INCOME.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-amber-50 rounded-md">
                <span className="text-sm text-gray-600">Monthly Expenses:</span>
                <span className="font-medium text-amber-700">${MONTHLY_EXPENSES.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                <span className="text-sm text-gray-600">Monthly Savings:</span>
                <span className="font-medium text-blue-700">${MONTHLY_SAVINGS.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-center text-gray-500">
              Based on your current financial data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

