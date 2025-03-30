from flask import request, jsonify, Blueprint
from openai import OpenAI
import os
from dotenv import load_dotenv
from models import Transaction, db
from datetime import datetime
import openai

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Create Flask Blueprint
ai_bp = Blueprint('ai', __name__)

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

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

    if not data or "messages" not in data:
        return jsonify({"error": "Missing 'messages' field in request body"}), 400

    try:
        response = client.chat.completions.create(
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

def get_financial_summary():
    """Get a summary of the user's financial data for AI analysis"""
    # Get current month and year
    now = datetime.now()
    current_month = now.month
    current_year = now.year
    
    # Get all transactions for current month
    transactions = Transaction.query.filter(
        Transaction.date.like(f'{current_year}-{current_month:02d}%')
    ).all()
    
    # Calculate totals
    total_income = sum(t.amount for t in transactions if t.is_income)
    total_expenses = sum(t.amount for t in transactions if not t.is_income)
    
    # Calculate spending by category
    category_totals = {}
    for t in transactions:
        if not t.is_income:
            category = t.category or 'other'
            category_totals[category] = category_totals.get(category, 0) + t.amount
    
    # Calculate savings rate
    savings = total_income - total_expenses
    savings_rate = (savings / total_income * 100) if total_income > 0 else 0
    
    return {
        'total_income': total_income,
        'total_expenses': total_expenses,
        'savings': savings,
        'savings_rate': savings_rate,
        'category_totals': category_totals,
        'month': current_month,
        'year': current_year
    }

@ai_bp.route('/api/ai-insights', methods=['GET'])
def get_ai_insights():
    try:
        # Get financial summary
        financial_data = get_financial_summary()
        
        # Prepare prompt for OpenAI
        prompt = f"""Based on the following financial data for {financial_data['month']}/{financial_data['year']}, 
        provide 2 brief good financial habits and 2 brief areas for improvement. Keep each point concise and actionable.

        Financial Data:
        - Total Income: ${financial_data['total_income']:.2f}
        - Total Expenses: ${financial_data['total_expenses']:.2f}
        - Savings: ${financial_data['savings']:.2f}
        - Savings Rate: {financial_data['savings_rate']:.1f}%
        
        Spending by Category:
        {', '.join(f'{cat}: ${amt:.2f}' for cat, amt in financial_data['category_totals'].items())}

        Format the response as a JSON object with two arrays:
        {{
            "good_habits": ["habit1", "habit2"],
            "bad_habits": ["area1", "area2"]
        }}
        """
        
        # Get AI response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial advisor providing concise, actionable advice."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        # Parse the response
        insights = response.choices[0].message.content
        return jsonify(insights)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to generate AI insights'
        }), 500
