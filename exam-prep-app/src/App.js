import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';


function App() {
  const [quizSettings, setQuizSettings] = useState({
    selectedModule: '',
    selectedExamType: '',
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home updateQuizSettings={setQuizSettings} />} />
        <Route path="/quiz" element={<Quiz {...quizSettings} />} />
        <Route path="/results" element={<Results />} />

      </Routes>
    </Router>
  );
}

export default App;
