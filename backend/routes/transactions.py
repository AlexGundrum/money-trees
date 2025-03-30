from datetime import datetime
from flask import Blueprint, request, jsonify
from extensions import db
from models import Transaction

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('', methods=['POST'])
def add_transaction():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'name' not in data or 'amount' not in data:
            return jsonify({"error": "Missing required fields"}), 400
            
        # Create new transaction
        transaction = Transaction(
            name=data['name'],
            amount=float(data['amount']),
            is_income=data.get('is_income', False),
            category=data.get('category', 'other'),
            user_email=data.get('email', 'demo@user.com')
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            "message": "Transaction added",
            "transaction": transaction.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@transactions_bp.route('', methods=['GET'])
def get_transactions():
    try:
        # Get query parameters
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        category = request.args.get('category')
        
        # Base query
        query = Transaction.query
        
        # Apply filters
        if month and year:
            query = query.filter(
                db.extract('month', Transaction.date) == month,
                db.extract('year', Transaction.date) == year
            )
        if category:
            query = query.filter_by(category=category)
            
        transactions = query.order_by(Transaction.date.desc()).all()
        
        return jsonify([t.to_dict() for t in transactions])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@transactions_bp.route('/summary', methods=['GET'])
def get_summary():
    try:
        month = request.args.get('month', type=int, default=datetime.utcnow().month)
        year = request.args.get('year', type=int, default=datetime.utcnow().year)
        
        transactions = Transaction.query.filter(
            db.extract('month', Transaction.date) == month,
            db.extract('year', Transaction.date) == year
        ).all()
        
        income = sum(t.amount for t in transactions if t.is_income)
        expenses = sum(t.amount for t in transactions if not t.is_income)
        
        return jsonify({
            "income": income,
            "expenses": expenses,
            "net": income - expenses,
            "month": month,
            "year": year
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500