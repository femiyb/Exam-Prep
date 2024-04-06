from flask import Flask, request
import openai
import os
import json

app = Flask(__name__)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/generate-question', methods=['POST'])
def generate_question():
    data = request.get_json()
    topic = data.get('topic', 'ReactJS')  # Fallback to 'ReactJS' if no topic is provided

    try:
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a knowledgeable assistant who creates insightful multiple-choice questions on various topics."},
                {"role": "user", "content": f"Create a multiple-choice question about {topic} including four options labeled A to D and indicate the correct answer."}
            ]
        )

        # Correctly extract the message text from the completion object
        message_text = completion.choices[0].message.content  # Adjust as necessary

        # Serialize the text and prepare it for saving
        content_to_save = {"topic": topic, "question": message_text}
        
        # Save to a JSON file
        with open('generated_content.json', 'w', encoding='utf-8') as f:
            json.dump(content_to_save, f, ensure_ascii=False, indent=4)

        return json.dumps({"response": message_text}), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        error_response_body = json.dumps({"error": str(e)})
        return error_response_body, 500, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True, port=5003)
