from extensions import db
class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # e.g., "Amazon Purchase"
    amount = db.Column(db.Float, nullable=False)
    is_income = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(50))  # Consider ENUM type
    date = db.Column(db.Date)            # Combined day/month/year
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))
    
    # New fields
    payment_method = db.Column(db.String(50))  # 'credit_card', 'bank_transfer'
    recurring = db.Column(db.Boolean, default=False)
    plaid_transaction_id = db.Column(db.String(100))  # For Plaid syncs