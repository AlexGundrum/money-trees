from flask import Blueprint, jsonify
import random

plaid_bp = Blueprint('plaid', __name__)

@plaid_bp.route('/link', methods=['GET'])
def get_link_token():
    return jsonify({"link_token": "mock-token-123"})

@plaid_bp.route('/transactions', methods=['GET'])
def mock_transactions():
    categories = ['food', 'transport', 'entertainment']
    return jsonify([{
        "id": i,
        "amount": -round(random.uniform(5, 100), 2),
        "category": random.choice(categories),
        "date": f"2023-06-{i:02d}"
    } for i in range(1, 8)])