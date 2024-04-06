import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Quiz.css'; // Ensure this path matches your CSS file's location

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { module, examType } = location.state || {}; // These are passed from the previous component
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState([]);
  

  useEffect(() => {
    setIsLoading(true);
    if (!module || !examType) {
        setError('Module and exam type are required.');
        setIsLoading(false);
        return;
    }


    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5006/get-questions');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        // Randomly pick 30 questions
        const shuffledQuestions = data.sort(() => 0.5 - Math.random()).slice(0, 30);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setError('Failed to load questions. Please try again.');
      }
      setIsLoading(false);
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedOption === '') {
      alert('Please select an option.');
      return;
    }
    const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
    if (isCorrect) {
      setCorrectAnswersCount(prevCount => prevCount + 1);
    }
    setResults(prevResults => [
      ...prevResults,
      {
        question: questions[currentQuestionIndex].question,
        userAnswer: selectedOption,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        isCorrect: isCorrect,
      }
    ]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentIndex => currentIndex + 1);
      setSelectedOption(''); // Reset for the next question
    } else {
      navigate('/results', { state: { results, correctAnswersCount, totalQuestions: questions.length } });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!questions.length) return <div>No questions found.</div>;

  return (
    <div className="quiz-container">
      <h2>Quiz: {module} - {examType}</h2>
      <form onSubmit={handleSubmit}>
        <div className="question">
          <p>{questions[currentQuestionIndex].question}</p>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name="option"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              {option}
            </label>
          ))}
        </div>
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Quiz;
