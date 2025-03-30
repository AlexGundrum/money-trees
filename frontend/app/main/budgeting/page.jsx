'use client';
import { useState, useEffect } from 'react';
import { DollarSign, PieChart, BarChart2, PlusCircle, TrendingUp, Leaf, Edit2, Trash2 } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import styles from './Budgeting.module.css';
import { analyzeText } from '@/services/api';
import Image from 'next/image';

// Consistent spending data across the application
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Housing', budget: 1200, spent: 1150, progress: 96 },
  { id: 2, name: 'Food', budget: 450, spent: 350, progress: 78 },
  { id: 3, name: 'Transportation', budget: 300, spent: 275, progress: 92 },
  { id: 4, name: 'Entertainment', budget: 150, spent: 80, progress: 53 },
  { id: 5, name: 'Utilities', budget: 200, spent: 190, progress: 95 },
  { id: 6, name: 'Education', budget: 300, spent: 300, progress: 100 },
];

export default function BudgetingPage() {
  const [selectedText, setSelectedText] = useState('');
  const [fullContext, setFullContext] = useState('');
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    budget: '',
    spent: '0'
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list', 'pie', 'bar'

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  // Prepare chart data
  const pieChartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => cat.budget),
        backgroundColor: [
          'rgba(46, 164, 79, 0.7)',
          'rgba(254, 161, 21, 0.7)',
          'rgba(56, 148, 198, 0.7)',
          'rgba(201, 79, 79, 0.7)',
          'rgba(159, 108, 239, 0.7)',
          'rgba(250, 176, 5, 0.7)'
        ],
        borderColor: [
          'rgba(46, 164, 79, 1)',
          'rgba(254, 161, 21, 1)',
          'rgba(56, 148, 198, 1)',
          'rgba(201, 79, 79, 1)',
          'rgba(159, 108, 239, 1)',
          'rgba(250, 176, 5, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Budget',
        data: categories.map(cat => cat.budget),
        backgroundColor: 'rgba(46, 164, 79, 0.7)',
        borderColor: 'rgba(46, 164, 79, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: categories.map(cat => cat.spent),
        backgroundColor: 'rgba(254, 161, 21, 0.7)',
        borderColor: 'rgba(254, 161, 21, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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
            const value = context.raw || 0;
            return `${label}: $${value}`;
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: $${value}`;
          }
        }
      }
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

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text) {
        setSelectedText(text);
        
        // Get the full context (the entire section)
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        
        // Find the closest section element
        let section = null;
        let element = startContainer;
        
        // If startContainer is a text node, get its parent
        if (startContainer.nodeType === Node.TEXT_NODE) {
          element = startContainer.parentElement;
        }
        
        // Traverse up until we find a section
        while (element && element.tagName !== 'SECTION') {
          element = element.parentElement;
        }
        
        if (element && element.tagName === 'SECTION') {
          section = element;
        }
        
        if (section) {
          const sectionText = Array.from(section.querySelectorAll('p'))
            .map(p => p.textContent)
            .join('\n');
          setFullContext(sectionText);
        }
        
        setShowSubmitButton(true);
        
        // Get the selection coordinates
        const rect = range.getBoundingClientRect();
        setButtonPosition({
          x: rect.left + (rect.width / 2),
          y: rect.bottom + window.scrollY + 10
        });
      } else {
        setShowSubmitButton(false);
        setSelectedText('');
        setFullContext('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeText(fullContext, selectedText);
      setAnalysis(data);
      setShowModal(true);
      
      // Clear selection and hide button
      window.getSelection().removeAllRanges();
      setShowSubmitButton(false);
      setSelectedText('');
      setFullContext('');
    } catch (error) {
      setError('Failed to analyze text. Please try again.');
      console.error('Error analyzing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setAnalysis(null);
    setError(null);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budget) return;

    const budget = parseFloat(newCategory.budget);
    const spent = parseFloat(newCategory.spent || 0);
    const progress = budget > 0 ? Math.round((spent / budget) * 100) : 0;

    const newCategoryObj = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: newCategory.name,
      budget,
      spent,
      progress
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory({ name: '', budget: '', spent: '0' });
    setIsAddingNew(false);
  };

  // Handle category update
  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name || !editingCategory.budget) return;

    const budget = parseFloat(editingCategory.budget);
    const spent = parseFloat(editingCategory.spent || 0);
    const progress = budget > 0 ? Math.round((spent / budget) * 100) : 0;

    const updatedCategoryObj = {
      ...editingCategory,
      budget,
      spent,
      progress
    };

    setCategories(categories.map(cat => cat.id === editingCategory.id ? updatedCategoryObj : cat));
    setEditingCategory(null);
  };

  // Handle category delete
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    if (editingCategory && editingCategory.id === id) {
      setEditingCategory(null);
    }
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress <= 70) return 'bg-green-500';
    if (progress <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 pb-20">
      <h1 className="page-title flex items-center">
        <span className="text-green-500 mr-2">💰</span>
        Budget Management
      </h1>

      {/* Budget Overview */}
      <div className="card hover:border-green-200 mb-8">
        <h2 className="text-xl font-semibold text-green-800 mb-6 flex items-center">
          <DollarSign size={20} className="text-green-600 mr-2" />
          Budget Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-green-700">${totalBudget.toLocaleString()}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-amber-600">${totalSpent.toLocaleString()}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(totalSpent / totalBudget) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Remaining</p>
            <p className="text-2xl font-bold text-blue-600">${remainingBudget.toLocaleString()}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(remainingBudget / totalBudget) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
          <button 
            onClick={() => setActiveView('list')} 
            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${activeView === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <BarChart2 size={16} className="mr-1" />
            List
          </button>
          <button 
            onClick={() => setActiveView('pie')} 
            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${activeView === 'pie' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <PieChart size={16} className="mr-1" />
            Pie Chart
          </button>
          <button 
            onClick={() => setActiveView('bar')} 
            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${activeView === 'bar' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <TrendingUp size={16} className="mr-1" />
            Bar Chart
          </button>
        </div>
        
        <button 
          onClick={() => setIsAddingNew(true)} 
          className="btn-primary btn-sm flex items-center"
          disabled={isAddingNew || editingCategory}
        >
          <PlusCircle size={16} className="mr-1" />
          Add Category
        </button>
      </div>

      {/* Add New Category Form */}
      {isAddingNew && (
        <div className="card hover:border-green-200 mb-6 border-green-300 bg-green-50/30">
          <h3 className="font-semibold text-green-800 mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Entertainment"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                  value={newCategory.budget}
                  onChange={(e) => setNewCategory({...newCategory, budget: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Spent (optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                  value={newCategory.spent}
                  onChange={(e) => setNewCategory({...newCategory, spent: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="btn-primary btn-sm"
              disabled={!newCategory.name || !newCategory.budget}
            >
              Add Category
            </button>
          </div>
        </div>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="card hover:border-green-200 mb-6 border-amber-300 bg-amber-50/30">
          <h3 className="font-semibold text-amber-800 mb-4">Edit Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Entertainment"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0.00"
                  value={editingCategory.budget}
                  onChange={(e) => setEditingCategory({...editingCategory, budget: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Spent</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0.00"
                  value={editingCategory.spent}
                  onChange={(e) => setEditingCategory({...editingCategory, spent: e.target.value})}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setEditingCategory(null)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCategory}
              className="btn-primary btn-sm"
              disabled={!editingCategory.name || !editingCategory.budget}
            >
              Update Category
            </button>
          </div>
        </div>
      )}

      {/* List View */}
      {activeView === 'list' && (
        <div className="card hover:border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <Leaf size={20} className="text-green-600 mr-2" />
            Budget Categories
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-50 border-b border-green-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Budget</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Spent</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Progress</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-green-50/30">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">${category.budget.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">${category.spent.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(category.progress)}`}
                            style={{ width: `${Math.min(category.progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${category.progress > 90 ? 'text-red-600' : 'text-gray-600'}`}>
                          {category.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          disabled={isAddingNew || editingCategory}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          disabled={isAddingNew || editingCategory}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No budget categories found. Create one to get started!
            </div>
          )}
        </div>
      )}

      {/* Pie Chart View */}
      {activeView === 'pie' && (
        <div className="card hover:border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <PieChart size={20} className="text-green-600 mr-2" />
            Budget Allocation
          </h2>
          
          <div className="h-96">
            {categories.length > 0 ? (
              <Pie data={pieChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No budget categories found to display chart.
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            Visualizing how your budget is allocated across different categories
          </div>
        </div>
      )}

      {/* Bar Chart View */}
      {activeView === 'bar' && (
        <div className="card hover:border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <BarChart2 size={20} className="text-green-600 mr-2" />
            Budget vs. Spending
          </h2>
          
          <div className="h-96">
            {categories.length > 0 ? (
              <Pie data={barChartData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No budget categories found to display chart.
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            Comparing your budgeted amounts with actual spending for each category
          </div>
        </div>
      )}

      {/* Tips for Budgeting */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <Leaf size={20} className="text-green-600 mr-2" />
          Budgeting Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card hover:border-green-200 bg-green-50/30">
            <h3 className="font-medium text-green-800 mb-2">50/30/20 Rule</h3>
            <p className="text-sm text-gray-600">Allocate 50% of your income to needs, 30% to wants, and 20% to savings.</p>
          </div>
          
          <div className="card hover:border-green-200 bg-amber-50/30">
            <h3 className="font-medium text-amber-800 mb-2">Track Your Spending</h3>
            <p className="text-sm text-gray-600">Regularly update your spending to get a clear picture of your financial habits.</p>
          </div>
          
          <div className="card hover:border-green-200 bg-blue-50/30">
            <h3 className="font-medium text-blue-800 mb-2">Adjust When Needed</h3>
            <p className="text-sm text-gray-600">Budgets aren't set in stone. Revise yours as your financial situation changes.</p>
          </div>
        </div>
      </div>

      {showSubmitButton && (
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          Analyze Text
        </button>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            
            {loading ? (
              <div className={styles.loading}>Analyzing text...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : analysis ? (
              <>
                <h2>Analysis Results</h2>
                <div className={styles.analysisSection}>
                  <h3>Clearer Explanation</h3>
                  <p className={styles.restatement}>{analysis.restatement}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Key Financial Implications</h3>
                  <p>{analysis.implications}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Potential Risks or Concerns</h3>
                  <p>{analysis.risks}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Recommendations for Improvement</h3>
                  <p>{analysis.recommendations}</p>
                </div>
                <div className={styles.analysisSection}>
                  <h3>Related Financial Concepts</h3>
                  <p>{analysis.related_concepts}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
} 