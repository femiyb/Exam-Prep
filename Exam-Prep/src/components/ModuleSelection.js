// ModuleSelection.js
import React, { useEffect } from 'react';

const ModuleSelection = ({ selectedModule, onGenerateQuestions }) => {
  useEffect(() => {
    if (!selectedModule) return; // Do nothing if no module is selected

    // Define a mapping from module IDs to topics
    const topics = {
      "1": "ReactJS",
      "2": "NodeJS",
      "3": "PHP",
      "4": "WordPress",
    };

    const topic = topics[selectedModule];
    if (topic) {
      // Trigger question generation for the selected topic
      onGenerateQuestions(topic, 2); // Assuming you want to generate 2 questions
    }
  }, [selectedModule, onGenerateQuestions]);

  return null; // This component doesn't render anything by itself
};

export default ModuleSelection;
