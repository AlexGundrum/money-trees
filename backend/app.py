from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db, migrate
from models import User, Goal, Debt, Transaction, Budget
from routes import *
from routes.ai import ai_bp
# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Ensure instance directory exists
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    os.makedirs(instance_path, exist_ok=True)
    
    # Set database path
    db_path = os.path.join(instance_path, 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
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
    from routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(debts_bp, url_prefix='/api/debts')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    @app.route('/')
    def health_check():
        return {"status": "active", "models": ["User", "Goal", "Debt", "FinancialInfo", "Budget"]}
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)