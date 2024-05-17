import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CourseDetail.css';

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [selectedExamType, setSelectedExamType] = useState('');
    const [visibleSection, setVisibleSection] = useState(null);

    useEffect(() => {
        async function fetchCourseData() {
            try {
                const module = await import(`../json/course-detail-${id}.json`);
                setCourse(module[id]);
            } catch (error) {
                console.error('Error loading the course data:', error);
            }
        }

        fetchCourseData();
    }, [id]);
    const toggleSection = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    const handleExamTypeChange = (event) => {
        setSelectedExamType(event.target.value);
    };

    const handleStartQuiz = () => {
        if (!selectedExamType) {
            alert('Please select an exam type before starting the quiz.');
            return;
        }
        navigate(`/quiz`, {
            state: {
                module: id, // Assuming "Course Title" is a string identifying the module
                examType: selectedExamType
            }
        });

    };
    if (!course) {
        return (
            <div className="course-detail-container">
                <h2>Course not found</h2>
                <button onClick={() => navigate('/courses')}>Back to Courses</button>
            </div>
        );
    }

    return (
        <div className="course-detail-container">
            <h1>{course["Course Title"]}</h1>
            <div className="section-headers">
                <span onClick={() => toggleSection('overview')}>Course Overview</span>
                <span onClick={() => toggleSection('curriculum')}>Curriculum Outline</span>
                <span onClick={() => toggleSection('syllabus')}>Detailed Syllabus</span>
                <span onClick={() => toggleSection('schedule')}>Study Schedule</span>
                <span onClick={() => toggleSection('assessment')}>Assessment Methods</span>
                <span onClick={() => toggleSection('resources')}>Resources</span>
                <span onClick={() => toggleSection('development')}>Professional Development</span>
                <span onClick={() => toggleSection('support')}>Well-being and Support</span>
                <span onClick={() => toggleSection('feedback')}>Feedback and Improvement</span>
                <span onClick={() => toggleSection('exam')}>Start Practice Exam</span>

            </div>
            {visibleSection === 'overview' && (
                <div className="section-content">
                    <p><strong>Objectives:</strong> {course["Course Overview"]["Course Objectives"].join(", ")}</p>
                    <p><strong>Prerequisites:</strong> {course["Course Overview"]["Prerequisites"].join(", ")}</p>
                    <p><strong>Credit Hours:</strong> {course["Course Overview"]["Credits"]}</p>
                </div>
            )}
            {visibleSection === 'curriculum' && (
                <div className="section-content">
                    <ul>
                        {course["Curriculum Outline"]["Core Topics"].map((topic, index) => (
                            <li key={index}>{topic}</li>
                        ))}
                        <li><strong>Seminars/Workshops:</strong> {course["Curriculum Outline"]["Seminar/Workshop Details"].join(", ")}</li>
                    </ul>
                </div>
            )}
            {visibleSection === 'syllabus' && (
                <div className="section-content">
                    {course["Detailed Syllabus"].map((item, index) => (
                        <div key={index}>
                            <p><strong>Week {item.Week}:</strong> {item.Topic}</p>
                            <p><strong>Reading:</strong> {item.Reading}</p>
                            <p><strong>Assignment:</strong> {item.Assignment}</p>
                            {item.Activity && <p><strong>Activity:</strong> {item.Activity}</p>}
                        </div>
                    ))}
                </div>
            )}
            {visibleSection === 'schedule' && (
                <div className="section-content">
                    <p><strong>Time Management Tips:</strong> {course["Study Schedule"]["Time Management Tips"].join(", ")}</p>
                    <p><strong>Important Deadlines:</strong> {course["Study Schedule"]["Important Deadlines"].join(", ")}</p>
                </div>
            )}
            {visibleSection === 'assessment' && (
                <div className="section-content">
                    <p><strong>Grading Policy:</strong> Assignments {course["Assessment Methods"]["Grading Policy"].Assignments}%, Participation {course["Assessment Methods"]["Grading Policy"].Participation}%</p>
                    <p><strong>Assignment Guidelines:</strong></p>
                    <ul>
                        <li><strong>Format:</strong> {course["Assessment Methods"]["Assignment Guidelines"]["Format"]}</li>
                        <li><strong>Submission:</strong> {course["Assessment Methods"]["Assignment Guidelines"]["Submission"]}</li>
                        <li><strong>Evaluation:</strong> {course["Assessment Methods"]["Assignment Guidelines"]["Evaluation"]}</li>
                    </ul>
                    <p><strong>Exam Preparation:</strong> {course["Assessment Methods"]["Exam Preparation"].join(", ")}</p>
                </div>
            )}
            {visibleSection === 'resources' && (
                <div className="section-content">
                    <p><strong>Online Platforms:</strong> {course["Resources"]["Online Platforms"].join(", ")}</p>
                    <p><strong>Software Tools:</strong> {course["Resources"]["Software Tools"].join(", ")}</p>
                    <p><strong>Prescribed Textbooks:</strong> {course["Resources"]["Prescribed Textbooks"].map((book, index) => (
                        <div key={index}>{book.Title} by {book.Author} ({book.Publisher}, {book.PublicationYear}) ISBN: {book.ISBN}</div>
                    ))}</p>
                    <p><strong>Recommended Reading:</strong> {course["Resources"]["Recommended Reading"].map((book, index) => (
                        <div key={index}>{book.Title} by {book.Authors} ({book.Publisher}, {book.PublicationYear}) ISBN: {book.ISBN}</div>
                    ))}</p>
                    <p><strong>Study Groups:</strong> {course["Resources"]["Study Groups"].join(", ")}</p>
                </div>
            )}
            {visibleSection === 'development' && (
                <div className="section-content">
                    <p><strong>Internships:</strong> {course["Professional Development"]["Internships"]}</p>
                    <p><strong>Career Services:</strong> {course["Professional Development"]["Career Services"]}</p>
                    <p><strong>Networking:</strong> {course["Professional Development"]["Networking"]}</p>
                </div>
            )}
            {visibleSection === 'support' && (
                <div className="section-content">
                    <p><strong>Student Support Services:</strong> {course["Well-being and Support"]["Student Support Services"]}</p>
                    <p><strong>Work-Life Balance:</strong> {course["Well-being and Support"]["Work-Life Balance"]}</p>
                </div>
            )}
            {visibleSection === 'feedback' && (
                <div className="section-content">
                    <p><strong>Continuous Improvement:</strong> {course["Feedback and Improvement"]["Continuous Improvement"]}</p>
                    <p><strong>Revision History:</strong> {course["Feedback and Improvement"]["Revision History"]}</p>
                </div>
            )}
            {visibleSection === 'exam' && (
                <div className="section-content">
                    <p>Choose the type of practice exam you would like to start:</p>
                    <select onChange={handleExamTypeChange} value={selectedExamType}>
                        <option value="">Select Exam Type</option>
                        <option value="MC">Multiple Choice</option>
                        <option value="Theory">Theory</option>
                        <option value="Essay">Essays</option>
                        <option value="Case-Studies">Case Studies</option>
                    </select>
                    <button onClick={handleStartQuiz}>Start Quiz</button>
                </div>
            )}
             <button onClick={() => navigate('/courses')}>Back to Courses</button>

        </div>
    );
}

export default CourseDetail;
