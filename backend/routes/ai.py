from flask import request, jsonify, current_app
import openai
import os

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """
    Expected payload:
    {
        "messages": [
            {"role": "user", "content": "How do I save for a house?"}
        ],
        "model": "gpt-3.5-turbo",  # Optional
        "max_tokens": 150  # Optional
    }
    """
    data = request.json
    openai.api_key = os.getenv('OPENAI_API_KEY')

    try:
        response = openai.ChatCompletion.create(
            model=data.get('model', 'gpt-3.5-turbo'),
            messages=data['messages'],
            max_tokens=data.get('max_tokens', 200),
            temperature=0.7  # Control creativity
        )
        return jsonify({
            "reply": response.choices[0].message.content,
            "usage": response.usage
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500