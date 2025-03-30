'use client';

import { useState, useEffect, useRef } from 'react';
import { Plant, Trophy, DollarSign, ArrowRight, Check, Play, Pause, RefreshCcw } from 'lucide-react';
import SavingsTreeSlider from '@/components/SavingsTreeSlider';

export default function SavingsPage() {
  // Mock goal status for initial development
  const [goalData, setGoalData] = useState({
    id: 1,
    name: "Emergency Fund",
    target: 5000,
    current: 2750,
    createdAt: "January 15, 2025",
    deadline: "December 31, 2025",
    contributions: [
      { date: "January 2025", amount: 500 },
      { date: "February 2025", amount: 750 },
      { date: "March 2025", amount: 600 },
      { date: "April 2025", amount: 500 },
      { date: "May 2025", amount: 400 },
    ]
  });

  const [hasGoal, setHasGoal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoAmount, setDemoAmount] = useState(0);
  const animationRef = useRef(null);
  const [animationSpeed, setAnimationSpeed] = useState(1); // 1x speed

  // Control form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setGoalData({
        id: 1,
        name: formData.goalName,
        target: parseFloat(formData.targetAmount),
        current: 0,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        deadline: "December 31, 2025",
        contributions: []
      });
      setHasGoal(true);
      setLoading(false);
    }, 1000);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate percentage progress
  const progress = goalData ? Math.round((goalData.current / goalData.target) * 100) : 0;
  
  // Animation for growth demo
  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const targetProgress = progress;
    const targetAmount = goalData.current;
    
    // Reset if already at full progress
    if (demoProgress >= targetProgress) {
      setDemoProgress(0);
      setDemoAmount(0);
    }
    
    // Animation frame function
    const animate = () => {
      setDemoProgress(prev => {
        const newProgress = prev + (0.2 * animationSpeed);
        if (newProgress >= targetProgress) {
          setIsAnimating(false);
          return targetProgress;
        }
        
        // Update amount based on progress percentage
        const progressRatio = newProgress / 100;
        setDemoAmount(progressRatio * targetAmount);
        
        animationRef.current = requestAnimationFrame(animate);
        return newProgress;
      });
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const pauseAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    }
  };
  
  const resetAnimation = () => {
    pauseAnimation();
    setDemoProgress(0);
    setDemoAmount(0);
  };
  
  const changeSpeed = () => {
    setAnimationSpeed(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 4;
      return 1;
    });
  };
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Empty State Component when no goal is set
  const EmptyState = () => (
    <div className="card hover:border-green-200 text-center py-10 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full">
        <Plant size={32} className="text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">Start Growing Your Savings</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Create a savings goal to track your progress and watch your money grow like a tree in your financial forest.
      </p>
      <button 
        onClick={() => setHasGoal(false)} 
        className="btn-primary inline-flex items-center"
      >
        <Plant size={16} className="mr-2" />
        Create Savings Goal
      </button>
    </div>
  );

  // Goal Setup Form Component
  const GoalSetupForm = () => (
    <div className="card hover:border-green-200">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Set Your Savings Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Name
          </label>
          <input
            id="goalName"
            name="goalName"
            type="text"
            required
            placeholder="e.g. Emergency Fund, Vacation, etc."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            value={formData.goalName}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              id="targetAmount"
              name="targetAmount"
              type="number"
              required
              min="1"
              step="0.01"
              placeholder="0.00"
              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={formData.targetAmount}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Savings Goal'}
          </button>
        </div>
      </form>
    </div>
  );

  // Goal View Component
  const GoalView = () => (
    <div className="space-y-8">
      <div className="card hover:border-green-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold text-green-800 mr-2">{goalData.name}</h2>
              {progress === 100 && (
                <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-0.5 flex items-center">
                  <Trophy size={12} className="mr-1" /> Completed!
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">Started on {goalData.createdAt}</p>
          </div>
          
          <div className="bg-green-50 px-4 py-2 rounded-lg text-center min-w-[150px] mt-4 md:mt-0">
            <p className="text-xs text-gray-600 mb-1">Target Date</p>
            <p className="font-medium text-green-800">{goalData.deadline}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Current: <span className="font-medium text-green-700">${goalData.current.toLocaleString()}</span></span>
            <span className="text-gray-600">Goal: <span className="font-medium text-green-800">${goalData.target.toLocaleString()}</span></span>
          </div>
          
          <div className="mb-6">
            <SavingsTreeSlider progress={progress} />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-sm font-medium text-green-700">{progress}% complete</span>
              <span className="text-xs text-gray-600">${(goalData.target - goalData.current).toLocaleString()} remaining</span>
            </div>
            
            <button className="btn-primary btn-sm">
              <DollarSign size={14} className="mr-1" />
              Add Funds
            </button>
          </div>
        </div>
      </div>
      
      {/* Growth Animation Demo */}
      <div className="card hover:border-green-200 overflow-hidden">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Watch Your Money Grow</h2>
        <p className="text-sm text-gray-600 mb-4">This demo shows how your money grows over time along with your savings tree.</p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Animation Controls */}
          <div className="lg:w-1/3">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-green-800 mb-2">Growth Demo</h3>
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={startAnimation}
                  disabled={isAnimating}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center text-sm ${isAnimating ? 'bg-gray-100 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  <Play size={14} className="mr-1" />
                  Play
                </button>
                <button 
                  onClick={pauseAnimation}
                  disabled={!isAnimating}
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center text-sm ${!isAnimating ? 'bg-gray-100 text-gray-500' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                >
                  <Pause size={14} className="mr-1" />
                  Pause
                </button>
                <button 
                  onClick={resetAnimation}
                  className="flex-1 py-2 px-3 rounded-md flex items-center justify-center text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  <RefreshCcw size={14} className="mr-1" />
                  Reset
                </button>
              </div>
              
              <button 
                onClick={changeSpeed}
                className="w-full py-2 px-3 bg-white border border-gray-300 rounded-md text-sm flex items-center justify-center"
              >
                Speed: {animationSpeed}x
              </button>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Amount:</span>
                  <span className="font-bold text-green-700">${demoAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="font-bold text-green-700">{demoProgress.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              <p>Based on your monthly contribution rate of ~${Math.round(goalData.current / goalData.contributions.length)}</p>
            </div>
          </div>
          
          {/* Tree Animation */}
          <div className="lg:w-2/3 flex flex-col items-center">
            <div className="h-64 w-full bg-gradient-to-b from-green-50 to-white rounded-lg p-4 relative">
              {/* Money Particles */}
              {isAnimating && (
                <>
                  <div className="absolute w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-full animate-float1 left-1/4 bottom-0">
                    <DollarSign size={16} />
                  </div>
                  <div className="absolute w-6 h-6 flex items-center justify-center bg-green-100 text-green-700 rounded-full animate-float2 left-2/3 bottom-0">
                    <DollarSign size={14} />
                  </div>
                  <div className="absolute w-7 h-7 flex items-center justify-center bg-green-100 text-green-700 rounded-full animate-float3 left-1/2 bottom-0">
                    <DollarSign size={16} />
                  </div>
                </>
              )}
              
              {/* Tree that grows based on progress */}
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 transition-all duration-500 flex flex-col items-center">
                {/* Tree trunk */}
                <div 
                  className="bg-green-800 rounded-t-sm transition-all duration-500" 
                  style={{ 
                    width: `${4 + (demoProgress * 0.06)}px`, 
                    height: `${40 + (demoProgress * 1.2)}px` 
                  }}
                ></div>
                
                {/* Tree foliage - multiple layers */}
                <div 
                  className="absolute bottom-full bg-green-600 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${20 + (demoProgress * 0.9)}px`, 
                    height: `${20 + (demoProgress * 0.9)}px`,
                    opacity: demoProgress > 10 ? 1 : 0
                  }}
                ></div>
                <div 
                  className="absolute bottom-full transform translate-y-10 bg-green-500 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${30 + (demoProgress * 1.0)}px`, 
                    height: `${30 + (demoProgress * 1.0)}px`,
                    opacity: demoProgress > 30 ? 1 : 0
                  }}
                ></div>
                <div 
                  className="absolute bottom-full transform translate-y-25 bg-green-400 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${40 + (demoProgress * 1.1)}px`, 
                    height: `${40 + (demoProgress * 1.1)}px`,
                    opacity: demoProgress > 50 ? 1 : 0
                  }}
                ></div>
              </div>
              
              {/* Ground */}
              <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-amber-100 to-amber-50 rounded-b-lg"></div>
            </div>
            
            <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-4 bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                style={{ width: `${demoProgress}%` }}
              ></div>
            </div>
            
            <div className="mt-2 flex justify-between w-full text-sm text-gray-600">
              <span>$0</span>
              <span>${goalData.target.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card hover:border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {goalData.contributions.length > 0 ? (
              goalData.contributions.slice().reverse().map((contrib, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <DollarSign size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-green-800">Deposit</h3>
                      <span className="font-bold text-green-700">+${contrib.amount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{contrib.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No activity yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips for Success */}
        <div className="card hover:border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Tips for Success</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-sm text-gray-700">Set up automatic transfers to grow your savings effortlessly</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-sm text-gray-700">Track your progress weekly to stay motivated</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-sm text-gray-700">Cut small expenses to boost your contributions</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 flex-shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-sm text-gray-700">Celebrate milestones to maintain motivation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">🌱</span>
        Grow Your Savings
      </h1>
      
      {/* Show progress path */}
      {hasGoal && (
        <div className="mb-6 text-sm bg-green-50 p-3 rounded-lg flex items-center">
          <div className="flex-1 flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-2">1</div>
            <span className="font-medium text-green-800">Set Goal</span>
            <ArrowRight size={16} className="text-green-300 mx-2" />
          </div>
          
          <div className="flex-1 flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-2">2</div>
            <span className="font-medium text-green-800">Make Contributions</span>
            <ArrowRight size={16} className="text-green-300 mx-2" />
          </div>
          
          <div className="flex-1 flex items-center">
            <div className={`w-6 h-6 rounded-full ${progress === 100 ? 'bg-green-500 text-white' : 'bg-green-200 text-green-700'} flex items-center justify-center text-xs mr-2`}>3</div>
            <span className={`font-medium ${progress === 100 ? 'text-green-800' : 'text-green-600'}`}>Reach Goal</span>
          </div>
        </div>
      )}
    
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {hasGoal ? <GoalView /> : (loading ? <div className="card p-10 text-center">Loading...</div> : <GoalSetupForm />)}
      
      {!hasGoal && !loading && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => setHasGoal(true)}
            className="text-green-600 hover:text-green-800 text-sm hover:underline"
          >
            Cancel and go back
          </button>
        </div>
      )}
    </div>
  );
} 