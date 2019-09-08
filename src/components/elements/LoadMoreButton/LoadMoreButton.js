import React from 'react';

import "./LoadMoreButton.css";

const LoadMoreButton = (props) => {
  return (
    <div 
      className="rmdb-loadmorebtn"
      onClick={props.onClick} >
      <p>{props.text}</p>
    </div>
  );
};

export default LoadMoreButton;