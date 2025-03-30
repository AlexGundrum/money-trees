from extensions import db
class Debt(db.Model):
    __tablename__ = 'debts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # e.g., "Student Loan"
    principal = db.Column(db.Float)                   # Original amount owed
    amount_paid = db.Column(db.Float, default=0)      # Fixed typo
    remaining_balance = db.Column(db.Float)           # Renamed from amoutn owed
    interest_rate = db.Column(db.Float)               # Fixed typo
    term_months = db.Column(db.Integer)               # Added clarity
    minimum_payment = db.Column(db.Float)             # New field
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))
    
    # New fields
    debt_type = db.Column(db.String(50))  # 'credit_card', 'student_loan', 'mortgage'
    start_date = db.Column(db.Date)