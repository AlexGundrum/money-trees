from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db, migrate
from models import User, Goal, Debt, Transaction, Budget
from routes import *
from routes.ai import ai_bp
from openai import OpenAI

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Ensure instance directory exists
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    os.makedirs(instance_path, exist_ok=True)
    
    # Set database path
    db_path = os.path.join(instance_path, 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configure OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.goals import goals_bp
    from routes.debts import debts_bp
    from routes.transactions import transactions_bp
    from routes.budget import budget_bp
    from routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(debts_bp, url_prefix='/api/debts')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    @app.route('/')
    def health_check():
        return {"status": "active", "models": ["User", "Goal", "Debt", "FinancialInfo", "Budget"]}
    
    @app.route('/analyze', methods=['POST', 'OPTIONS'])
    def analyze_text():
        if request.method == 'OPTIONS':
            # Handle preflight request
            response = jsonify({'status': 'ok'})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Methods', 'POST')
            return response

        try:
            data = request.get_json()
            full_text = data.get('full_text', '')
            highlighted_text = data.get('highlighted_text', '')

            if not highlighted_text:
                return jsonify({'error': 'No text selected'}), 400

            # Prepare the prompt for OpenAI
            prompt = f"""Please analyze the following highlighted text in the context of the full text. 
            Provide a clear restatement and detailed analysis focusing on financial implications and recommendations.

            Full Text:
            {full_text}

            Highlighted Text:
            {highlighted_text}

            Please provide your analysis in the following format:

            RESTATEMENT:
            [Provide a clear, concise restatement of the highlighted text]

            IMPLICATIONS:
            [List the key financial implications]

            RISKS:
            [Describe potential risks or concerns]

            RECOMMENDATIONS:
            [Provide recommendations for improvement]

            RELATED CONCEPTS:
            [List related financial concepts to consider]"""

            # Call OpenAI API
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a financial analysis expert. Provide clear, concise, and actionable insights."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
            except Exception as e:
                print(f"OpenAI API error: {str(e)}")
                return jsonify({'error': 'Failed to get analysis from OpenAI'}), 500

            # Extract the analysis from the response
            analysis = response.choices[0].message.content

            # Parse the analysis into structured sections
            sections = {}
            current_section = None
            current_text = []

            for line in analysis.split('\n'):
                line = line.strip()
                if not line:
                    continue
                
                if line.endswith(':'):
                    if current_section and current_text:
                        sections[current_section.lower()] = '\n'.join(current_text)
                    current_section = line[:-1]
                    current_text = []
                elif current_section:
                    current_text.append(line)

            # Add the last section
            if current_section and current_text:
                sections[current_section.lower()] = '\n'.join(current_text)

            # Create the result object with default empty strings
            result = {
                'restatement': sections.get('restatement', ''),
                'implications': sections.get('implications', ''),
                'risks': sections.get('risks', ''),
                'recommendations': sections.get('recommendations', ''),
                'related_concepts': sections.get('related concepts', '')
            }

            # Validate that we have at least a restatement
            if not result['restatement']:
                return jsonify({'error': 'Failed to generate analysis'}), 500

            response = jsonify(result)
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            return response

        except Exception as e:
            print(f"Error in analyze_text: {str(e)}")  # Add logging
            return jsonify({'error': str(e)}), 500
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)