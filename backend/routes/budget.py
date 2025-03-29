from flask import Blueprint, request, jsonify
from extensions import db
from models import Budget, FinancialInfo

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('', methods=['POST'])
def set_budget():
    data = request.json
    budget = Budget(
        user_email=data.get('email', 'demo@user.com'),
        category_limits=data['categories']  # {"food": 500, "rent": 1500}
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify({"message": "Budget updated"})

@budget_bp.route('/status', methods=['GET'])
def budget_status():
    budget = Budget.query.first()  # Demo: Get first budget
    transactions = FinancialInfo.query.filter_by(is_income=False).all()
    
    status = {}
    for category, limit in budget.category_limits.items():
        spent = sum(t.amount for t in transactions if t.category == category)
        status[category] = {
            "limit": limit,
            "spent": spent,
            "remaining": limit - spent
        }
    
    return jsonify(status)