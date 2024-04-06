from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # This line enables CORS globally for all domains, fine for development but consider adjusting for production.

@app.route('/get-questions-<module>-<examType>', methods=['GET'])
def get_questions(module, examType):
    try:
        # Use f-string to dynamically construct the file path
        filepath = f'json/questions-{module}-{examType}.json'
        with open(filepath, 'r', encoding='utf-8') as file:
            questions = json.load(file)
        return jsonify(questions), 200
    except FileNotFoundError:
        return jsonify({"error": f"Questions file for {module} and {examType} not found."}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5006)
