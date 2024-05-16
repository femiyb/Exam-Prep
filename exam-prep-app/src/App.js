import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Register from './components/Register';
import Login from './components/Login';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Navigation from './components/Navigation'; // Import the Navigation component
import { AuthProvider } from './AuthContext'; 

function App() {
  const [quizSettings, setQuizSettings] = useState({
    selectedModule: '',
    selectedExamType: '',
  });

  return (
    <Router>
      <AuthProvider> {/* Wrapping entire app in AuthProvider */}
        <Navigation /> {/* Use the Navigation component */}
          <Routes>
            <Route path="/" element={<Home updateQuizSettings={setQuizSettings} />} />
            <Route path="/quiz" element={<Quiz {...quizSettings} />} />
            <Route path="/results" element={<Results />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/course/:id" exact component={CourseDetail} />
            <Route path="/quiz/:id/:type" component={Quiz} />
            
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
