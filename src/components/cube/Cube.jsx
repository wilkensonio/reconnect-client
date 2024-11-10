// Cube.js
import React from 'react';
import './Cube.css';

const Cube = () => {
  return (
    <div className="scene">
      <div className="cube">
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face right"></div>
        <div className="face left"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
        <div className="center-image"></div>
    </div>
  );
};

export default Cube;
