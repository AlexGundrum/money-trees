from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    
    email = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer)
    monthly_income = db.Column(db.Float)
    plaid_access_token = db.Column(db.String(200))
    password_hash = db.Column(db.String(128))
    
    # Relationships - IMPORTANT: Use class names as strings
    goals = db.relationship('Goal', backref='user', cascade='all, delete-orphan')
    debts = db.relationship('Debt', backref='user', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', backref='user', cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='user', cascade='all, delete-orphan')