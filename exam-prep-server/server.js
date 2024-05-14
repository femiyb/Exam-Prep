require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3059;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const corsOptions = {
    origin: '*', // or '*' to allow any origin
  };
  
app.use(cors()); // This opens up CORS to all origins. For production, configure allowed origins.
  
app.use(express.json());

app.get('/', (req, res) => {
  res.send('OpenAI Quiz Generator API is running.');
});


app.post('/generate-question', async (req, res) => {
    console.log(req.body); // Should output: { module: '1', examType: 'Multiple Choice' }

    const moduleMapping = {
        '1': 'ReactJS',
        '2': 'NodeJS',
        '3': 'PHP',
        '4': 'WordPress',
    };

    const moduleTopic = moduleMapping[req.body.module];
    const examType = req.body.examType;

    
    console.log("moduleTopic:", moduleTopic);
    console.log("examType:", examType);

    
    // Validate inputs
    if (examType === "Multiple Choice") {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [{
                    "role": "system",
                    "content": `Generate a quiz question about ${moduleTopic} in the following JSON structure: {question: 'The question text', options: ['option1', 'option2', 'option3', 'option4'], correctAnswer: 'option1'}.`,
                }, {
                    "role": "user",
                    "content": ""
                }],
                max_tokens: 150,
            });
    
            const generatedText = response.choices[0].message.content.trim();
            console.log("Generated Text:", generatedText);
    
            // Parsing logic to convert the plain text response into structured JSON
            const parseResponseToJSON = (generatedText) => {
                const optionsRegex = /A\) (.*?) B\) (.*?) C\) (.*?) D\) (.*)/;
                const correctAnswerRegex = /Correct answer: (A|B|C|D)\)/;
    
                const optionsMatch = generatedText.match(optionsRegex);
                const correctAnswerMatch = generatedText.match(correctAnswerRegex);
    
                if (optionsMatch && correctAnswerMatch) {
                    const correctOptionIndex = ['A', 'B', 'C', 'D'].indexOf(correctAnswerMatch[1]);
                    const correctAnswer = optionsMatch[correctOptionIndex + 1]; // +1 because match groups start at 1
    
                    return {
                        question: generatedText.split('A)')[0].trim(),
                        options: optionsMatch.slice(1, 5), // Extracting the four options
                        correctAnswer: correctAnswer,
                    };
                }
    
                // Fallback if parsing fails
                return { question: 'Parsing error: Unable to extract question and options.', options: [], correctAnswer: '' };
            };
    
            const generatedQuestion = parseResponseToJSON(generatedText);
            
            // Logging for debugging
            console.log("Generated Question JSON:", generatedQuestion);
            
            // Responding with the structured question
            res.json({ success: true, question: generatedQuestion });
    
        } catch (error) {
            console.error('Failed to generate question:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
    
    

    if (examType === "Theory")
    {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [{
                    "role": "system",
                    "content": `Generate a ${examType} question about ${moduleTopic}:`,
                }, {
                    "role": "user",
                    "content": ""
                }],
                max_tokens: 60,
            });
    
            res.json({ success: true, response: response.choices[0].message.content.trim() });
        } catch (error) {
            console.error('Failed to generate question:', error);
    
            res.status(500).json({ success: false, error: error.message });
        }
    }
    
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
