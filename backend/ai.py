from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import openai
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

def validate_text(text):
    """Validate the input text."""
    if not text or not isinstance(text, str):
        return False, "Invalid text input"
    if len(text.strip()) < 10:
        return False, "Text is too short for meaningful analysis"
    if len(text.strip()) > 2000:
        return False, "Text is too long for analysis"
    return True, text.strip()

def create_analysis_prompt(full_text, highlighted_text):
    """Create a detailed prompt for AI analysis with emphasis on restating highlighted text."""
    return f"""As a financial education expert, your task is to:
1. First, clearly restate the highlighted text in simpler terms while preserving all key financial concepts
2. Then provide a comprehensive educational analysis of the financial concepts

--- RESTATEMENT REQUIREMENTS ---
* Rephrase the highlighted text in clearer language
* Maintain all key financial terms and concepts
* Keep the same meaning and nuance
* Make it more accessible for students
* Length should be similar to original

--- ANALYSIS REQUIREMENTS ---
After the restatement, provide this detailed analysis in JSON format:

Full Context:
{full_text}

Highlighted Text (to be restated and analyzed):
{highlighted_text}

{{
    "restatement": "Your clear, educational rephrasing of the highlighted text goes here",
    "key_points": [
        "3-4 main financial ideas from the highlighted text",
        "Focus on principles and learning outcomes"
    ],
    "recommendations": [
        "2-3 practical steps based on the concept",
        "Include specific examples"
    ],
    "sentiment": "positive/negative/neutral",
    "difficulty_level": "beginner/intermediate/advanced",
    "related_topics": [
        "2-3 related financial concepts"
    ],
    "learning_outcomes": [
        "2-3 specific understandings from this concept"
    ],
    "context_analysis": {{
        "how_it_fits": "How this connects to the full context",
        "prerequisites": "Required prior knowledge",
        "next_steps": "Suggested learning path"
    }}
}}

Guidelines for the entire response:
1. Start with a perfect restatement before the JSON analysis
2. Keep all financial terminology accurate
3. Make complex ideas accessible without oversimplifying
4. Provide concrete examples where possible
5. Maintain an educational tone suitable for students
6. Ensure the restatement stands alone as a clear explanation
"""

def analyze_text_with_ai(full_text, highlighted_text):
    """Analyze text using OpenAI's API with error handling and retries."""
    try:
        # Validate both texts
        is_valid_full, result_full = validate_text(full_text)
        is_valid_highlighted, result_highlighted = validate_text(highlighted_text)
        
        if not is_valid_full:
            return {"error": f"Invalid full text: {result_full}"}
        if not is_valid_highlighted:
            return {"error": f"Invalid highlighted text: {result_highlighted}"}

        # Create the prompt
        prompt = create_analysis_prompt(result_full, result_highlighted)

        # Call OpenAI API with retry logic
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a financial education expert specializing in student financial literacy. Provide clear, educational analysis focused on learning outcomes."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )

                # Extract and parse the response
                ai_response = response.choices[0].message.content
                analysis = json.loads(ai_response)
                
                # Add metadata
                analysis["metadata"] = {
                    "timestamp": datetime.now().isoformat(),
                    "model": "gpt-3.5-turbo",
                    "full_text_length": len(result_full),
                    "highlighted_text_length": len(result_highlighted)
                }
                
                return analysis

            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error on attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries - 1:
                    raise
                continue
            except Exception as e:
                logger.error(f"Error on attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries - 1:
                    raise
                continue

    except Exception as e:
        logger.error(f"Error in AI analysis: {str(e)}")
        return {
            "error": "Failed to analyze text",
            "details": str(e)
        }

@app.route('/analyze', methods=['POST'])
@limiter.limit("10 per minute")  # Rate limit for this specific endpoint
def analyze():
    """Endpoint for text analysis with comprehensive error handling."""
    try:
        # Log the incoming request
        logger.info("Received analysis request")
        
        # Get and validate request data
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 400

        data = request.get_json()
        full_text = data.get('full_text')
        highlighted_text = data.get('highlighted_text')

        if not full_text or not highlighted_text:
            return jsonify({
                "error": "Both full_text and highlighted_text are required"
            }), 400

        # Get AI analysis
        analysis = analyze_text_with_ai(full_text, highlighted_text)
        
        # Check for errors in analysis
        if "error" in analysis:
            return jsonify(analysis), 500

        # Log successful analysis
        logger.info("Successfully completed text analysis")
        
        return jsonify(analysis)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 