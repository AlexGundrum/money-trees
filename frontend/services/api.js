// lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const DEFAULT_EMAIL = 'user@example.com'; // From your API docs

/**
 * Base fetch wrapper with error handling
 */
async function fetchWrapper(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// ================== Authentication ================== //
export async function registerUser(email, name) {
  return fetchWrapper('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
}

// ================== Goals ================== //
export async function createGoal(name, targetAmount) {
  return fetchWrapper('/goals', {
    method: 'POST',
    body: JSON.stringify({ 
      name, 
      target_amount: targetAmount,
      email: DEFAULT_EMAIL 
    }),
  });
}

export async function fetchGoals() {
  const goals = await fetchWrapper('/goals');
  return goals.map(goal => ({
    ...goal,
    progress: parseFloat(goal.progress.replace('%', '')) // Convert "50%" to 50
  }));
}

// ================== Debts ================== //
export async function createDebt(debtData) {
  return fetchWrapper('/debts', {
    method: 'POST',
    body: JSON.stringify(debtData),
  });
}

export async function fetchMinimumPayments() {
  return fetchWrapper('/debts/minimum-payments');
}

// ================== Transactions ================== //
export async function createTransaction(transactionData) {
  return fetchWrapper('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
}

export async function fetchTransactionSummary() {
  const summary = await fetchWrapper('/transactions/summary');
  return {
    ...summary,
    net: parseFloat(summary.net.toFixed(2)) // Ensure proper decimal places
  };
}

export async function fetchTransactions({ page = 1, limit = 100, filters = {} }) {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    console.log("WE GOT HERE OMG THANK THE HEAVENS");
    return fetchWrapper(`/transactions?${queryParams}`);
  }

// ================== Budget ================== //
export async function updateBudget(categories) {
  return fetchWrapper('/budget', {
    method: 'POST',
    body: JSON.stringify({ categories }),
  });
}

export async function fetchBudgetStatus() {
  const status = await fetchWrapper('/budget/status');
  // Convert all string numbers to floats
  return Object.fromEntries(
    Object.entries(status).map(([category, data]) => [
      category,
      {
        limit: parseFloat(data.limit),
        spent: parseFloat(data.spent),
        remaining: parseFloat(data.remaining)
      }
    ])
  );
}

// ================== Plaid ================== //
export async function getPlaidLinkToken() {
  return fetchWrapper('/plaid/link');
}

export async function fetchPlaidTransactions() {
  return fetchWrapper('/plaid/transactions');
}

// ================== Utility Functions ================== //
export function calculateGoalProgress(currentAmount, targetAmount) {
  return (currentAmount / targetAmount) * 100;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}