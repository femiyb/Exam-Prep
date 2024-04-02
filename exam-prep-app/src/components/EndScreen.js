import React from 'react';
import { Link } from 'react-router-dom';

function EndScreen() {
  return (
    <div>
      <h1>Thank you for taking the quiz!</h1>
      <p>Check out our other quizzes.</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default EndScreen;
