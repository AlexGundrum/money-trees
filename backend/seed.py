import random
from datetime import datetime, timedelta
from models import db, Transaction
from app import create_app

app = create_app()

def seed_transactions():
    categories = [
        'Food', 'Transportation', 'Housing', 
        'Entertainment', 'Utilities', 'Healthcare'
    ]
    
    with app.app_context():
        # Clear existing data
        db.session.query(Transaction).delete()
        
        # Generate 6 months of data
        for i in range(180):  # ~180 transactions (6 months)
            date = datetime.now() - timedelta(days=random.randint(0, 180))
            is_income = random.random() > 0.85  # 15% income
            
            if is_income:
                name = random.choice(['Paycheck', 'Freelance', 'Bonus'])
                amount = round(random.uniform(500, 2500), 2)
                category = 'Income'
            else:
                category = random.choice(categories)
                name = random.choice([
                    f'{category} Purchase',
                    f'Weekly {category}',
                    f'Monthly {category}'
                ])
                
                # Category-specific amount ranges
                if category == 'Housing':
                    amount = round(random.uniform(800, 1500), 2)
                elif category == 'Food':
                    amount = round(random.uniform(5, 50), 2)
                else:
                    amount = round(random.uniform(10, 200), 2)
            
            transaction = Transaction(
                name=name,
                amount=amount,
                is_income=is_income,
                category=category,
                date=date,
                user_email='user@example.com'
            )
            db.session.add(transaction)
        
        db.session.commit()
        print("Generated 180 transactions")

if __name__ == '__main__':
    seed_transactions()