import React from 'react';
import './LoadingSpinner.css';

/**
 * A reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner (small, medium, large)
 * @param {string} [props.color='#3498db'] - Color of the spinner
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ size = 'medium', color = '#3498db' }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className={`spinner-container ${sizeClass}`}>
      <div 
        className="spinner"
        style={{ borderColor: `${color}20`, borderTopColor: color }}
      />
    </div>
  );
};

export default React.memo(LoadingSpinner); 