from flask import Flask, request
import openai
import os
import json

app = Flask(__name__)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def parse_generated_content(content):
    """
    Attempts to parse the generated content into structured question,
    options, and the correct answer, regardless of strict formatting.
    """
    try:
        lines = content.strip().split('\n')
        question = next((line.split('Question:', 1)[1].strip() for line in lines if 'question:' in line.lower()), None)
        options = [line.split(')', 1)[1].strip() for line in lines if ')' in line and line[0].isalpha() and line[1] == ')']
        correct_answer_line = next((line for line in lines if 'correct answer:' in line.lower()), None)

        if not options or not correct_answer_line:
            print(f"Failed to parse options or correct answer: {content}")
            return None

        correct_answer = correct_answer_line.split('Correct Answer:', 1)[1].strip()
        correct_answer = correct_answer.split(')', 1)[1].strip() if ')' in correct_answer else correct_answer

        return {
            "question": question,
            "options": options,
            "correctAnswer": correct_answer
        }
    except Exception as e:
        print(f"An error occurred during parsing: {e}")
        return None

@app.route('/generate-question', methods=['POST'])
def generate_question():
    data = request.get_json()
    topic = data.get('topic', 'Default Topic')  # Fallback if no topic is provided
    max_retries = 3
    attempts = 0

    while attempts < max_retries:
        try:
            completion = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a knowledgeable assistant who creates insightful multiple-choice questions on various topics."},
                    {"role": "user", "content": f"Create a multiple-choice question about {topic} including four options labeled A to D and indicate the correct answer."}
                ]
            )

            parsed_content = parse_generated_content(completion.choices[0].message.content)
            if parsed_content is None:
                attempts += 1
                print(f"Attempt {attempts}: Failed to parse generated content. Retrying...")
                continue

            # Load existing questions or initialize an empty list
            try:
                with open('generated_content.json', 'r', encoding='utf-8') as file:
                    questions = json.load(file)
            except FileNotFoundError:
                questions = []
            
            # Assign an ID to the new question and append it to the questions list
            new_question = parsed_content
            new_question["id"] = len(questions) + 1
            questions.append(new_question)
            
            # Save the updated list of questions back to the file
            with open('generated_content.json', 'w', encoding='utf-8') as file:
                json.dump(questions, file, ensure_ascii=False, indent=4)
            
            return json.dumps({"response": "Question added successfully."}), 200, {'Content-Type': 'application/json'}

        except Exception as e:
            print(f"An error occurred: {e}")
            attempts += 1
    
    # If we reach here, it means all attempts failed
    return json.dumps({"error": "Failed to generate a valid question after multiple attempts."}), 500, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True, port=5003)
