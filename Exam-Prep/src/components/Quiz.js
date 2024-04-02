import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { module, examType } = location.state || {}; // Ensure these are passed correctly from the Home component
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // New state to track correct answers
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState([]);


  

  useEffect(() => {
    setIsLoading(true);
    if (!module || !examType) {
      setError('Module or exam type is missing.');
      setIsLoading(false);
      return;
    }

    const loadQuestions = async () => {
      try {
        const questionsModule = await import(`../json/questions-${module}-${examType}.json`);
        setQuestions(questionsModule.default);
      } catch (err) {
        console.error("Failed to load questions", err);
        setError('Failed to load questions. Please try again.');
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [module, examType]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
    let newCorrectCount = correctAnswersCount;
    
    if (isCorrect) {
      newCorrectCount += 1;
    }
  
    setResults(prevResults => [
      ...prevResults,
      {
        question: questions[currentQuestionIndex].question,
        userAnswer: selectedOption,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        isCorrect: isCorrect,
      },
    ]);
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(''); // Reset for the next question
      setCorrectAnswersCount(newCorrectCount);
    } else {
      navigate('/results', {
        state: {
          results: results,
          correctAnswersCount: newCorrectCount,
          totalQuestions: questions.length,
        },
      });
    }
  };
  

  // Function to handle finishing the exam early
  const finishExam = () => {
    if (examType === "Theory") {
      navigate('/'); // Navigate back to the HomePage for theory exams
    } else {
      navigate('/results', {
        state: { 
          correctAnswersCount,
          results: results,
          totalQuestions: currentQuestionIndex  // Adjust total questions based on how many were answered
        },
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!questions.length) return <div>No questions found.</div>;

  const { question, options } = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setShowAnswer(false); // Always hide the answer when moving to the next question or finishing the quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentIndex => currentIndex + 1);
    } else {
      // Check if it's a Theory quiz and handle accordingly
      if (examType === "Theory") {
        // Optionally show an alert message before navigating
        alert("You have completed the quiz. Thanks for participating!");

        // Navigate back to the HomePage
        navigate('/'); // Adjust if your home page route is different
      } else {
        setShowAnswer(false);
        if (selectedOption) {
          handleSubmit(new Event('submit')); // or just call the logic that handleSubmit would call
        }
        // For "Multiple Choice" quizzes, you might still navigate to a results page
        navigate('/results', {
          state: {
            totalQuestions: questions.length,
          },
        });
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentIndex => currentIndex - 1);
      setShowAnswer(false); // Optionally reset showAnswer state
    }
  };

  if (examType === "MC") {

  return (
<div className="quiz-container">
      <h2>Quiz: {module} - {examType}</h2>
      <form onSubmit={handleSubmit}>
        <p>{question}</p>
        {options.map((option, index) => (
          <div key={index}>
            <label>
              <input
                type="radio"
                name="option"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              {option}
            </label>
          </div>
        ))}
        <button className="button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
        <button className="button" type="submit">Next</button> 
        <button className="button finish-exam" onClick={finishExam}>Finish Exam</button>

      </form>
    </div>
  );
}

const currentQuestion = questions[currentQuestionIndex];

if (examType === "Theory"){
  return (
<div className="quiz-container">
    <h2>Quiz: {module} - {examType}</h2>
    <div className="options-container">
    <p className="question-text">{currentQuestion.question}</p>
      {examType === "Theory" && (
        <>
          {showAnswer && <p><strong>Proposed Answer:</strong> {currentQuestion.proposedAnswer}</p>}
          <button className="button finish-exam" onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? 'Hide Answer' : 'View Answer'}
          </button>
        </>
      )}
      <button className="button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
      <button className="button" onClick={handleNextQuestion}>Next</button>
      <button className="button finish-exam" onClick={finishExam}>Finish Exam</button>

    </div>
  </div>
  );

}
};

export default Quiz;
