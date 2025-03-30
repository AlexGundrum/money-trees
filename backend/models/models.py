from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    email = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer)
    monthly_income = db.Column(db.Float)
    plaid_access_token = db.Column(db.String(200))
    password_hash = db.Column(db.String(128))  # For future auth
    
    # Relationships
    goals = db.relationship('Goal', backref='user', cascade='all, delete-orphan')
    debts = db.relationship('Debt', backref='user', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', backref='user', cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='user', cascade='all, delete-orphan')

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0)
    target_date = db.Column(db.Date)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))
    priority = db.Column(db.Integer, default=3)
    is_achieved = db.Column(db.Boolean, default=False)

class Debt(db.Model):
    __tablename__ = 'debts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    principal = db.Column(db.Float)
    amount_paid = db.Column(db.Float, default=0)
    remaining_balance = db.Column(db.Float)
    interest_rate = db.Column(db.Float)
    term_months = db.Column(db.Integer)
    minimum_payment = db.Column(db.Float)
    debt_type = db.Column(db.String(50))
    start_date = db.Column(db.Date)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))



class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    is_income = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(50), default='other')
    user_email = db.Column(db.String(100), nullable=False, default='demo@user.com')
    date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Transaction {self.name} ${self.amount} ({self.category})>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'amount': self.amount,
            'is_income': self.is_income,
            'category': self.category,
            'date': self.date.isoformat(),
            'user_email': self.user_email
        }

class Budget(db.Model):
    __tablename__ = 'budgets'
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))
    period = db.Column(db.String(20), default='monthly')
    category_limits = db.Column(db.JSON)  # {"housing":1500, "food":600}