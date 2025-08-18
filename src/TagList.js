// TagList.js
import React from 'react';
import './App.css';

function TagList({ title, tags }) {
  return (
    <div className="tag-group">
      {title && <h3 className="tag-title">{title}</h3>}
      <div className="tag-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag-button">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TagList;
