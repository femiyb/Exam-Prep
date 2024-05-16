import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Courses.css';

function Courses() {
  const navigate = useNavigate();

  // Static list of courses with string IDs
  const [courses] = useState([
    { id: 'ASE', name: 'Advanced Software Engineering', description: 'Learn advanced software development techniques.' },
    { id: 'RM', name: 'Research Methodology', description: 'Understanding research methods in IT.' },
    { id: 'ITSG', name: 'Information Technology Security Governance', description: 'Explore IT security policies and governance.' },
    { id: 'ICS', name: 'Internet and CyberSecurity', description: 'Dive into cyber security practices and principles.' }
  ]);

  // Handler for when a user selects a course
  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="courses-container">
      <h2>Available Modules & Courses</h2>
      <ul className="course-list">
        {courses.map(course => (
          <li key={course.id} onClick={() => handleCourseClick(course.id)}>
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
