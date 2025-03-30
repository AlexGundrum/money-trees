from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from extensions import db
from models import Transaction
import traceback

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
            user_email=data.get('email', 'demo@user.com'),
            date=data.get('date', datetime.utcnow().date())  # Default to today if not provided
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            "message": "Transaction added",
            "transaction": transaction.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding transaction: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@transactions_bp.route('', methods=['GET'])
def get_transactions():
    try:
        # Get and validate query parameters
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)
        category = request.args.get('category')
        
        current_app.logger.info(f"Fetching transactions for month={month}, year={year}, category={category}")
        
        # Validate month and year if provided
        if month is not None:
            if not 1 <= month <= 12:
                return jsonify({"error": "Month must be between 1 and 12"}), 400
                
        if year is not None:
            if not 2000 <= year <= datetime.utcnow().year:
                return jsonify({"error": "Year must be between 2000 and current year"}), 400
        
        # Base query
        query = Transaction.query
        
        # Apply filters
        if month and year:
            # Use date range to ensure we get all transactions in the month
            start_date = datetime(year, month, 1).date()
            if month == 12:
                end_date = datetime(year + 1, 1, 1).date()
            else:
                end_date = datetime(year, month + 1, 1).date()
            
            current_app.logger.info(f"Filtering transactions between {start_date} and {end_date}")
            
            query = query.filter(
                Transaction.date >= start_date,
                Transaction.date < end_date
            )
        elif month or year:
            # If only one of month or year is provided, return error
            return jsonify({"error": "Both month and year must be provided together"}), 400
            
        if category:
            query = query.filter_by(category=category)
            
        # Order by date descending (most recent first)
        transactions = query.order_by(Transaction.date.desc()).all()
        
        current_app.logger.info(f"Found {len(transactions)} transactions")
        
        # Convert transactions to dictionary format
        transactions_list = []
        for t in transactions:
            try:
                transaction_dict = {
                    'id': t.id,
                    'name': t.name,
                    'amount': float(t.amount),
                    'is_income': bool(t.is_income),
                    'category': t.category or 'other',
                    'date': t.date.strftime('%Y-%m-%d') if t.date else None,
                    'payment_method': t.payment_method,
                    'recurring': bool(t.recurring)
                }
                transactions_list.append(transaction_dict)
            except Exception as e:
                current_app.logger.error(f"Error converting transaction {t.id}: {str(e)}")
                continue
        print(transactions_list)
        return jsonify({
            'transactions': transactions_list,
            'count': len(transactions_list),
            'month': month,
            'year': year
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching transactions: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@transactions_bp.route('/summary', methods=['GET'])
def get_summary():
    try:
        # Get and validate month and year parameters
        month = request.args.get('month', type=int, default=datetime.utcnow().month)
        year = request.args.get('year', type=int, default=datetime.utcnow().year)
        
        # Validate month and year
        if not 1 <= month <= 12:
            return jsonify({"error": "Month must be between 1 and 12"}), 400
        if not 2000 <= year <= datetime.utcnow().year:
            return jsonify({"error": "Year must be between 2000 and current year"}), 400
        
        # Use date range to ensure we get all transactions in the month
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date()
        else:
            end_date = datetime(year, month + 1, 1).date()
        
        current_app.logger.info(f"Fetching summary for transactions between {start_date} and {end_date}")
        
        transactions = Transaction.query.filter(
            Transaction.date >= start_date,
            Transaction.date < end_date
        ).all()
        
        # Calculate totals
        income = sum(float(t.amount) for t in transactions if t.is_income)
        expenses = sum(float(t.amount) for t in transactions if not t.is_income)
        net = income - expenses
        
        # Calculate category breakdown
        category_totals = {}
        for t in transactions:
            if not t.is_income:
                category = t.category or 'other'
                category_totals[category] = category_totals.get(category, 0) + float(t.amount)
        
        return jsonify({
            "income": income,
            "expenses": expenses,
            "net": net,
            "month": month,
            "year": year,
            "category_breakdown": category_totals
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching summary: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500