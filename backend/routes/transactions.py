from flask import Blueprint, request, jsonify
from extensions import db
from models import FinancialInfo
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('', methods=['POST'])
def add_transaction():
    data = request.json
    transaction = transactions_bp(
        name=data['name'],
        amount=data['amount'],
        is_income=data.get('is_income', False),
        category=data.get('category', 'other'),
        user_email=data.get('email', 'demo@user.com')
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction added"}), 201

@transactions_bp.route('/summary', methods=['GET'])
def monthly_summary():
    transactions = transactions_bp.query.filter(
        transactions_bp.date.between('2023-01-01', '2023-01-31')  # Demo dates
    ).all()
    
    summary = {
        'income': sum(t.amount for t in transactions if t.is_income),
        'expenses': sum(t.amount for t in transactions if not t.is_income)
    }
    return jsonify(summary)