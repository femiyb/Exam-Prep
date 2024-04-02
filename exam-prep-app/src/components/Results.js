import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/Results.css';

function Results() {
  const { state } = useLocation();
  const { results, totalQuestions } = state;

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      <p>You answered {results.filter(r => r.isCorrect).length} out of {totalQuestions} questions correctly!</p>
      <ul className="results-list">
        {results.map((result, index) => (
          <li key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
            <p className="question">{result.question}</p>
            <p className="your-answer">Your answer: {result.userAnswer}</p>
            {result.isCorrect ? (
              <p className="correct-answer">Correct!</p>
            ) : (
              <>
                <p className="correct-answer">Correct answer: {result.correctAnswer}</p>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
      <h1>Thank you for taking the quiz!</h1>
      <p>Check out other quizzes.</p>
      <Link to="/" className="try-again-link">Home</Link>
    </div>
    </div>
  );
}

export default Results;
