// ModuleSelector.js
import React from "react";

const ModuleSelector = ({ onSelect }) => (
  <select onChange={(e) => onSelect(e.target.value)} defaultValue="">
    <option value="" disabled>Select a module</option>
    <option value="1">ReactJS</option>
    <option value="2">NodeJS</option>
    <option value="3">PHP</option>
    <option value="4">WordPress</option>
  </select>
);

export default ModuleSelector;
