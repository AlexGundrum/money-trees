from extensions import db
class Budget(db.Model):
    __tablename__ = 'budgets'
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), db.ForeignKey('users.email'))
    
    # Time period (monthly/weekly/etc)
    period = db.Column(db.String(20), default='monthly')  
    
    # Category limits as JSON (flexible approach)
    category_limits = db.Column(db.JSON)  # Format: {"groceries": 500, "dining": 200}
    
    # OR alternative normalized structure:
    # budget_items = db.relationship('BudgetItem', backref='budget')