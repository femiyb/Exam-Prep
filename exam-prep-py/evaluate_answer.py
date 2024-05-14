import os
import json
import re
from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import gemini

app = Flask(__name__)
CORS(app)
evaluate_answer_bp = Blueprint('evaluate_answer', __name__)

# Load your Gemini API key from an environment variable (recommended for security)
gemini_api_key = os.getenv("AIzaSyDnuSNnRJWHhE-tnFap-anvGP6MFgbcxXA")
if not gemini_api_key:
    raise ValueError("AIzaSyDnuSNnRJWHhE-tnFap-anvGP6MFgbcxXA environment variable not set.")
client = gemini.RemoteClient(api_key=gemini_api_key)

# Cache for question data (to avoid repeated file reads)
question_cache = {}

@evaluate_answer_bp.route('/evaluate-answer-<module>-<examType>', methods=['POST'])
def evaluate_answer(module, examType):
    try:
        data = request.json
        question_id = data.get('questionId')
        user_answer = data.get('answer')

        # Load questions from JSON, with caching
        questions_key = f"{module}-{examType}"
        if questions_key not in question_cache:
            with open(f"{module}-{examType}.json", 'r') as f:
                question_cache[questions_key] = json.load(f)
        questions = question_cache[questions_key]

        # Check if the question exists
        question_item = next((q for q in questions if q['questionId'] == question_id), None)
        if not question_item:
            return jsonify({"error": "Question not found"}), 404

        proposed_answer = question_item.get('proposedAnswer')

        # Construct the prompt for Gemini
        prompt_message = (
            f"**Question:** {question_item['question']}\n"
            f"**User Answer:** {user_answer}\n"
            f"**Evaluate this answer to the question and provide a rating out of 10.**\n"
        )

        # Call Gemini API
        response = client.generate_content(prompt=prompt_message, max_tokens=100, temperature=0.7)
        full_response = response.text.strip()

        # Extract rating with regex
        rating_match = re.search(r"Rating:\s*(\d+)", full_response)
        rating = int(rating_match.group(1)) if rating_match else None

        return jsonify({"evaluation": full_response, "rating": rating, "proposedAnswer": proposed_answer}), 200

    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 400
    except gemini.GeminiException as e:
        return jsonify({"error": f"Gemini API error: {e}"}), 500
    except FileNotFoundError:
        return jsonify({"error": "Question data not found"}), 404
    except AttributeError as e: # Catch regex match error
        return jsonify({"error": f"Unable to extract rating: {e}"}), 500
    except Exception as e:  # Catch-all
        return jsonify({"error": f"An error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
