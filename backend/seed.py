import random
from datetime import datetime, timedelta
from models import db, User, Transaction, Goal, Debt, Budget
from app import create_app

app = create_app()

def seed_database():
    with app.app_context():
        try:
            # Clear existing data in safe order
            db.session.query(Transaction).delete()
            db.session.query(Goal).delete()
            db.session.query(Debt).delete()
            db.session.query(Budget).delete()
            db.session.query(User).delete()
            
            # Create test user
            test_user = User(
                email='user@example.com',
                name='Test User',
                age=28,
                monthly_income=4500.00,
                password_hash=''
            )
            db.session.add(test_user)
            db.session.commit()  # Commit user first
            
            # Generate transactions
            categories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities']
            for i in range(150):
                is_income = random.random() < 0.15
                date = datetime.utcnow() - timedelta(days=random.randint(0, 180))
                
                transaction = Transaction(
                    name=f"{'Income' if is_income else random.choice(categories)} {i+1}",
                    amount=round(random.uniform(1000, 3000), 2) if is_income 
                           else round(random.uniform(5, 200), 2),
                    is_income=is_income,
                    category='Income' if is_income else random.choice(categories),
                    date=date,
                    user_email=test_user.email,
                    payment_method=random.choice(['credit_card', 'debit_card', 'bank_transfer']),
                    recurring=random.random() < 0.3
                )
                db.session.add(transaction)
            
            # Create goals
            goals = [
                Goal(
                    name='Emergency Fund',
                    target_amount=10000,
                    current_amount=3200,
                    target_date=datetime.utcnow() + timedelta(days=365),
                    user_email=test_user.email,
                    priority=1
                ),
                Goal(
                    name='New Laptop',
                    target_amount=1500,
                    current_amount=450,
                    target_date=datetime.utcnow() + timedelta(days=90),
                    user_email=test_user.email
                )
            ]
            db.session.add_all(goals)
            
            # Create debts
            debts = [
                Debt(
                    name='Student Loan',
                    principal=25000,
                    remaining_balance=18000,
                    interest_rate=4.5,
                    term_months=120,
                    minimum_payment=300,
                    debt_type='education',
                    user_email=test_user.email,
                    start_date=datetime.utcnow() - timedelta(days=365)
                )
            ]
            db.session.add_all(debts)
            
            # Create budget
            budget = Budget(
                user_email=test_user.email,
                category_limits={
                    'Housing': 1200,
                    'Food': 400,
                    'Transportation': 200,
                    'Entertainment': 150,
                    'Utilities': 250
                }
            )
            db.session.add(budget)
            
            db.session.commit()
            print("✅ Database seeded successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding database: {str(e)}")
            raise

if __name__ == '__main__':
    seed_database()