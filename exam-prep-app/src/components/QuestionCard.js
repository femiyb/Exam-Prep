import React from "react";

function QuestionCard({ question, onAnswer}) {
    // Render Question and Options
    return (
        <div>
            <p>{question.text}</p>
            {question.options.map((option, index) => (
            <button key={index} onClick={() => onAnswer(question.id, option)}>
            {option}
            </button>))}
        </div>
        );
}

export default QuestionCard;
