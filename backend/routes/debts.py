from flask import Blueprint, request, jsonify
from extensions import db
from models import Debt

debts_bp = Blueprint('debts', __name__)

@debts_bp.route('', methods=['GET'])
def get_debts():
    debts = Debt.query.all()
    return jsonify([{
        "id": d.id,
        "name": d.name,
        "remaining": d.remaining_balance,
        "interest": d.interest_rate
    } for d in debts])

@debts_bp.route('/minimum-payments', methods=['GET'])
def total_minimum_payments():
    debts = Debt.query.all()
    total = sum(d.minimum_payment for d in debts)
    return jsonify({"total_minimum_payments": total})