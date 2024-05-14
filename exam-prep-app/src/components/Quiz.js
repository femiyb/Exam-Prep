import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Quiz.css'; // Ensure this path matches your CSS file's location

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { module, examType } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [rating, setRating] = useState(null);
  const [proposedAnswer, setProposedAnswer] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    if (!module || !examType) {
      setError('Module and exam type are required.');
      setIsLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const { default: data } = await import(`../json/questions-${module}-${examType}.json`);
        const shuffledQuestions = data.sort(() => 0.5 - Math.random()).slice(0, 30);
        setQuestions(shuffledQuestions);
        setShowAnswer(new Array(shuffledQuestions.length).fill(false));
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setError('Failed to load questions. Please try again.');
      }
      setIsLoading(false);
    };

    fetchQuestions();
  }, [module, examType]);

  const toggleShowAnswer = index => {
    setShowAnswer(current => 
      current.map((item, idx) => idx === index ? !item : item)
    );
  };

  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedOption;
    setCorrectAnswersCount(prev => isCorrect ? prev + 1 : prev);
    setResults(prev => [
      ...prev,
      {
        question: questions[currentQuestionIndex].question,
        userAnswer: selectedOption,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        isCorrect,
      },
    ]);
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption('');

    if (currentQuestionIndex >= questions.length - 1) {
      navigate('/results', {
        state: { results, correctAnswersCount, totalQuestions: questions.length },
      });
    }
  };

  const finishExam = () => {
    if (examType === "Theory") {
      navigate('/');
    } else {
      navigate('/results', {
        state: { 
          correctAnswersCount,
          results,
          totalQuestions: currentQuestionIndex + 1, // Adjust total questions based on how many were answered
        },
      });
    }
  };

  const submitTheoryAnswer = async () => {
    try {
      const response = await fetch(`https://exam-prep-41bea73ae791.herokuapp.com/evaluate-answer-${module}-${examType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          answer: userAnswer,
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setEvaluation(data.evaluation);
      setRating(data.rating);
      setProposedAnswer(data.proposedAnswer);
      toggleShowAnswer(currentQuestionIndex);
    } catch (error) {
      console.error('There was an error submitting the theory answer:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!questions.length) return <div>No questions found.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setShowAnswer(current => current.map((_, idx) => idx === currentQuestionIndex ? false : current[idx]));
    setEvaluation('');
    setRating(null);
    setProposedAnswer('');
    setUserAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (examType === "Theory") {
        alert("You have completed the quiz. Thanks for participating!");
        navigate('/');
      } else {
        navigate('/results', {
          state: { results, correctAnswersCount, totalQuestions: questions.length },
        });
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(current => current.map((_, idx) => idx === currentQuestionIndex ? false : current[idx]));
      setEvaluation('');
      setRating(null);
      setProposedAnswer('');
      setUserAnswer('');
    }
  };

  const renderEssayAnswer = answer => {
    if (typeof answer === 'object') {
      return (
        <ul>
          {Object.entries(answer).map(([key, value]) => (
            <li key={key}>
              <strong>{key.replace(/_/g, ' ')}:</strong> {typeof value === 'object' ? renderEssayAnswer(value) : value}
            </li>
          ))}
        </ul>
      );
    }
    return <p>{answer}</p>;
  };

  if (examType === "MC") {
    return (
      <div className="quiz-container">
        <h2>Quiz: {module} - {examType}</h2>
        <form onSubmit={handleSubmit}>
          <p>{currentQuestion.question}</p>
          {currentQuestion.options.map((option, index) => (
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

  if (examType === "Theory") {
    return (
      <div className="quiz-container">
        <h2>Quiz: {module} - {examType}</h2>
        <div className="options-container">
          <p className="question-text">{currentQuestion.question}</p>
          <textarea
            className="user-answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here"
          />
          <button className="button" onClick={submitTheoryAnswer}>Submit Answer</button>
          {showAnswer[currentQuestionIndex] && (
            <>
              <p><strong>Evaluation:</strong> {evaluation}</p>
              <p><strong>Rating:</strong> {rating} out of 10</p>
              <p><strong>Proposed Answer:</strong> {proposedAnswer}</p>
            </>
          )}
          <button className="button" onClick={() => toggleShowAnswer(currentQuestionIndex)}>
            {showAnswer[currentQuestionIndex] ? 'Hide Details' : 'Show Details'}
          </button>
          <button className="button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
          <button className="button" onClick={handleNextQuestion}>Next</button>
          <button className="button finish-exam" onClick={finishExam}>Finish Exam</button>
        </div>
      </div>
    );
  }

  if (examType === "Essay") {
    return (
      <div className="quiz-container">
        <h2>Quiz: {module} - {examType}</h2>
        <div className="options-container">
          <div className="question-container">
            <p className="question-text">{currentQuestion.question}</p>
            <p className="hint-text"><strong>Hint:</strong> {currentQuestion.hint}</p>
            {showAnswer[currentQuestionIndex] && (
              <div className="answer-details">
                <h3>Answer Details:</h3>
                {renderEssayAnswer(currentQuestion.answer)}
              </div>
            )}
            <button 
              className="button" 
              onClick={() => toggleShowAnswer(currentQuestionIndex)}>
              {showAnswer[currentQuestionIndex] ? 'Hide Answer Details' : 'Show Answer Details'}
            </button>
          </div>
          <button className="button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button className="button" onClick={handleNextQuestion}>
            Next
          </button>
          <button className="button finish-exam" onClick={finishExam}>
            Finish Exam
          </button>
        </div>
      </div>
    );
  }

  return null; // Default return to handle any unexpected cases
};

export default Quiz;
