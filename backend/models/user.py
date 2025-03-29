from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    email = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer)
    monthly_income = db.Column(db.Float)  # Consider making this an aggregate of financial_info records
    
    # Relationships
    goals = db.relationship('Goal', backref='user', cascade='all, delete-orphan')
    debts = db.relationship('Debt', backref='user', cascade='all, delete-orphan')
    transactions = db.relationship('transactions', backref='user', cascade='all, delete-orphan')
    
    # Authentication
    password_hash = db.Column(db.String(128))  # Add for future auth
    plaid_access_token = db.Column(db.String(200))  # Renamed from plaidApiInfoKey