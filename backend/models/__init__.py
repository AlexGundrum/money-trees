from extensions import db

# Import all models here
from .user import User
from .goal import Goal
from .budget import Budget
from .transaction import Transaction
from .debt import Debt
__all__ = ['db', 'User', 'Transaction', 'Goal', 'Debt', 'Budget']