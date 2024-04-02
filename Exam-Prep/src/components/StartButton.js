import React from 'react';

// Props could include 'onClick', 'text', and any other props you might find useful.
const StartButton = ({ onClick, text = 'Start Quiz' }) => {
  return (
    <button onClick={onClick} style={{ /* Add your custom styling here */ }}>
      {text}
    </button>
  );
};

export default StartButton;
