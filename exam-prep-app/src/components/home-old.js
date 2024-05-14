import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';


function Home() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleExamTypeChange = (event) => {
    setSelectedExamType(event.target.value);
  };

  const handleStartQuiz = () => {
    // Navigate to the Quiz page with module and examType as state
    navigate('/quiz', { state: { module: selectedModule, examType: selectedExamType } });
  };

  return (
<div className="home-container">
      <h1>Richfield Exam Prep Questions for BSc Honors in IT</h1>
      <label>
        Module:
        <select onChange={handleModuleChange} value={selectedModule}>
          <option value="" disabled>Select a module</option>
          <option value="ASE" data-module-name="Advanced Software Engineering">Advanced Software Engineering</option>
          <option value="RM" data-module-name="Research Methodology">Research Methodology</option>
          <option value="ITSG" data-module-name="Information Technology Security Governance">Information Technology Security Governance</option>
          <option value="CyberSecurity" data-module-name="CyberSecurity">Internet and CyberSecurity</option>
        </select>
      </label>
      <br />
      <label>
        Exam Type:
        <select onChange={handleExamTypeChange} value={selectedExamType}>
          <option value="" disabled>Select an exam type</option>
          <option value="MC" data-module-name="Multiple Choice">Multiple Choice</option>
          <option value="Theory" data-module-name="Theory">Theory</option>
        </select>
      </label>
      <br />
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
}

export default Home;
