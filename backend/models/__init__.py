from extensions import db

# Import all models here
from .user import User
from .goal import Goal
from .budget import Budget
from .transactions import Transaction
from .debt import Debt
__all__ = ['auth_bp', 'goals_bp', 'debts_bp', 'transactions_bp', 'budget_bp', 'plaid_bp']