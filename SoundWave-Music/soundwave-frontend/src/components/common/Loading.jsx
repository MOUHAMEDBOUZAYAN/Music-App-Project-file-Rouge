import React from "react";
import "../../styles/components.css";

const Loading = ({ message = "Loading..." }) => (
  <div className="loading-container">
    <div className="music-bars-loader">
      <div className="bar bar1" />
      <div className="bar bar2" />
      <div className="bar bar3" />
      <div className="bar bar4" />
      <div className="bar bar5" />
    </div>
    <span className="loading-message">{message}</span>
  </div>
);

export default Loading; 