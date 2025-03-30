from flask import Blueprint, request, jsonify
from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    user = User(
        email=data['email'],
        name=data.get('name', 'Demo User')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created (no auth)"})

# No login needed for demo