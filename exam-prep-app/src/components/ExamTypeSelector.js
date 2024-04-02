import React from 'react';

// Props include 'onSelect', a function to handle when an exam type is selected
const ExamTypeSelector = ({ onSelect }) => {
  // This array holds the different exam types you offer; modify it as needed
  const examTypes = ['Multiple Choice', 'Theory'];

  return (
    <div>
      <label htmlFor="examType">Choose an exam type:</label>
      <select name="examType" id="examType" onChange={(e) => onSelect(e.target.value)}>
        {/* Optionally, you can add a default option like so */}
        <option value="">Select an exam type</option>
        {examTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExamTypeSelector;
