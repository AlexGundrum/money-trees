from flask import Flask
from dotenv import load_dotenv
import os
from extensions import db, migrate
from models import User, Goal, Debt, Transaction, Budget
from routes import *
# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///instance/app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.goals import goals_bp
    from routes.debts import debts_bp
    from routes.transactions import transactions_bp
    from routes.budget import budget_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(debts_bp, url_prefix='/api/debts')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    
    @app.route('/')
    def health_check():
        return {"status": "active", "models": ["User", "Goal", "Debt", "FinancialInfo", "Budget"]}
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)