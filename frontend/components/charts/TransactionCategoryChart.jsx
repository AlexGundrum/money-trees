// components/charts/TransactionCategoryChart.jsx
'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchTransactions } from '@/services/api';

Chart.register(...registerables);

export default function TransactionCategoryChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const loadDataAndCreateChart = async () => {
      try {
        // Get current month and year
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
          if (!transaction.is_income) { // Only count expenses
            const category = transaction.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
          }
          return acc;
        }, {});

        // Prepare data for Chart.js
        const labels = Object.keys(categoryData);
        const dataValues = Object.values(categoryData);

        // Generate colors
        const backgroundColors = labels.map((_, index) => 
          `hsl(${(index * 360) / labels.length}, 70%, 50%)`
        );

        // Destroy previous chart instance if exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create new chart
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
          type: 'pie', // or 'bar' for bar chart
          data: {
            labels,
            datasets: [{
              data: dataValues,
              backgroundColor: backgroundColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });

      } catch (error) {
        console.error('Error loading transaction data:', error);
      }
    };

    loadDataAndCreateChart();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}