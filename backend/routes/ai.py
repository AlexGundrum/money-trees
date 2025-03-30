from flask import request, jsonify, Blueprint
from openai import OpenAI
import os
from dotenv import load_dotenv
from models import Transaction, db
from datetime import datetime
import openai
import json
from functools import lru_cache
import time

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Create Flask Blueprint
ai_bp = Blueprint('ai', __name__)

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

# Cache for storing the last API call time and response
last_api_call = {
    'time': 0,
    'response': None
}

# Cache duration in seconds (5 minutes)
CACHE_DURATION = 5 * 60

@ai_bp.route('/chat', methods=['POST'])
def chat():
    """
    Expected payload:
    {
        "messages": [
            {"role": "user", "content": "How do I save for a house?"}
        ],
        "model": "gpt-4o-mini",  # Optional
        "max_tokens": 500  # Optional
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
    """Get enhanced financial summary with ratios and benchmarks"""
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
    
    # Define spending benchmarks (percentage of income)
    benchmarks = {
        'Housing': 30,
        'Food': 15,
        'Transportation': 15,
        'Entertainment': 5,
        'Utilities': 10,
        'Education': 10,
        'Other': 15
    }
    
    # Initialize category structure
    categories = {
        category: {
            'total': 0,
            'percentage_of_income': 0,
            'benchmark': benchmarks[category],
            'over_benchmark': False
        } 
        for category in benchmarks
    }
    
    # Calculate spending by category
    for t in transactions:
        if not t.is_income:
            category = t.category if t.category in benchmarks else 'Other'
            categories[category]['total'] += t.amount
    
    # Calculate percentages and benchmark comparisons
    for category in categories:
        if total_income > 0:
            percentage = (categories[category]['total'] / total_income) * 100
            categories[category]['percentage_of_income'] = round(percentage, 1)
            categories[category]['over_benchmark'] = percentage > categories[category]['benchmark']
    
    # Calculate savings
    savings = total_income - total_expenses
    savings_rate = round((savings / total_income * 100), 1) if total_income > 0 else 0
    
    # Identify top 3 expenses
    sorted_categories = sorted(
        categories.items(),
        key=lambda x: x[1]['total'],
        reverse=True
    )
    top_expenses = [
        {
            'name': name,
            'amount': data['total'],
            'percentage': data['percentage_of_income']
        } 
        for name, data in sorted_categories[:3]
    ]
    
    return {
        'month': current_month,
        'year': current_year,
        'total_income': total_income,
        'total_expenses': total_expenses,
        'savings': savings,
        'savings_rate': savings_rate,
        'categories': categories,
        'benchmarks': benchmarks,
        'top_expenses': top_expenses,
        'transaction_count': len(transactions),
        'analysis_ready': total_income > 0  # Flag for whether analysis is possible
    }

@ai_bp.route('/api', methods=['GET'])
def get_ai_insights():
    try:
        current_time = time.time()
        
        # Check if we have a cached response and it's still valid
        if last_api_call['response'] and (current_time - last_api_call['time'] < CACHE_DURATION):
            print("Returning cached response")
            return jsonify(last_api_call['response'])
        
        print("Fetching new AI insights...")
        # Get financial summary
        financial_data = get_financial_summary()
        print("Financial data:", json.dumps(financial_data, indent=2))
        
        # Return mock data instead of making API call
        mock_response = {
            "good_habits": [
                f"You're saving {financial_data['savings_rate']:.1f}% of your income, which is above the recommended 20%",
                f"Your {max(financial_data['categories'].items(), key=lambda x: x[1]['total'])[0]} spending is well-managed at {max(financial_data['categories'].items(), key=lambda x: x[1]['percentage_of_income'])[1]['percentage_of_income']:.1f}% of your income"
            ],
            "bad_habits": [
                f"Your {max(financial_data['categories'].items(), key=lambda x: x[1]['total'])[0]} spending is high at {max(financial_data['categories'].items(), key=lambda x: x[1]['percentage_of_income'])[1]['percentage_of_income']:.1f}% of your income, consider reviewing this category",
                f"Your savings rate of {financial_data['savings_rate']:.1f}% is below the recommended 20%"
            ]
        }
        
        print("Returning mock insights:", json.dumps(mock_response, indent=2))
        # Cache the response
        last_api_call['time'] = current_time
        last_api_call['response'] = mock_response
        return jsonify(mock_response)
        
    except Exception as e:
        print("Error generating mock insights:", str(e))
        return jsonify({
            'error': 'Failed to generate insights',
            'message': str(e)
        }), 500
