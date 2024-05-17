import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Register from './components/Register';
import Login from './components/Login';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Navigation from './components/Navigation';
import ForgotPassword from './components/ForgotPassword'; // Import the ForgotPassword component
import { AuthProvider } from './AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [quizSettings, setQuizSettings] = useState({
    selectedModule: '',
    selectedExamType: '',
  });

  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home updateQuizSettings={setQuizSettings} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add Forgot Password route */}
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Quiz {...quizSettings} />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:id/:type" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
