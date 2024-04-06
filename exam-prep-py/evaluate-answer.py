from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for development purposes

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/evaluate-answer', methods=['POST'])
def evaluate_answer():
    data = request.json
    user_answer = data['answer']
    question = data['question']
    
    # Construct a prompt for OpenAI
    prompt = f"Given the question: {question}, and the answer: {user_answer}, rate the answer on a scale of 1 to 10 for accuracy and completeness."

    response = openai.Completion.create(
      engine="davinci",
      prompt=prompt,
      max_tokens=60,
      n=1,
      stop=None,
      temperature=0.5
    )
    
    # Assuming the response text includes a score you can extract
    # This is a simplistic example; you might need a more robust extraction method
    score_text = response.choices[0].text.strip()
    # Extract the score from the response, assuming it's a single digit followed by text
    score = ''.join(filter(str.isdigit, score_text))  # Extracts digits from the response

    return jsonify({"score": score or "Score not found"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5006)
