import React, { useState } from 'react';

const ContributionForm = ({ onContribute, currentAmount, goalAmount }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const remaining = goalAmount - currentAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }
    
    if (parseFloat(amount) > remaining) {
      setError(`Amount exceeds remaining goal (${remaining.toFixed(2)})`);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // For now, just pass the data to the parent component
      // In a real app, you'd send this to your API
      onContribute(parseFloat(amount));
      setAmount(''); // Clear the form
    } catch (err) {
      console.error('Error adding contribution:', err);
      setError('Failed to add contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Money to Your Goal</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="contribution-amount">
            Contribution Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-600">$</span>
            <input
              id="contribution-amount"
              type="number"
              min="1"
              max={remaining}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Any amount up to $${remaining.toFixed(2)}`}
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium 
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Remaining to reach goal: <span className="font-medium">${remaining.toFixed(2)}</span></p>
      </div>
    </div>
  );
};

export default ContributionForm; 