from flask import Blueprint, request, jsonify
from extensions import db
from models.goal import Goal

goals_bp = Blueprint('goals', __name__)

@goals_bp.route('', methods=['POST'])
def create_goal():
    """Create a new savings goal"""
    data = request.get_json()
    goal = Goal(
        name=data['name'],
        target_amount=data['target_amount'],
        deadline=data['deadline'],  # e.g., "2024-12-31"
        user_id=data['user_id']
    )
    db.session.add(goal)
    db.session.commit()
    return jsonify({"message": "Goal created!", "id": goal.id}), 201

@goals_bp.route('', methods=['GET'])
def list_goals():
    """Get all goals for a user"""
    user_id = request.args.get('user_id')
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": g.id,
        "name": g.name,
        "progress": g.current_amount / g.target_amount,
        "deadline": g.deadline
    } for g in goals])

# Add PUT/DELETE endpoints as needed