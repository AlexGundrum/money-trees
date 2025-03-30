# models/goal.py
from extensions import db

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)  # Renamed from amontNeeded
    current_amount = db.Column(db.Float, default=0)      # Renamed from amountSaved
    target_date = db.Column(db.Date)                    # Renamed from goalDate
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))
    
    # New fields
    priority = db.Column(db.Integer, default=3)  # 1-5 scale
    is_achieved = db.Column(db.Boolean, default=False)