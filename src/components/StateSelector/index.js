import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCurrentState,
  removeCurrentState,
  addDesiredState,
  removeDesiredState
} from '../../store/userSlice';
import './styles.css';

const StateSelector = ({ type, options, question, showSelectedStates = true }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedStates = useSelector(state => 
    type === 'current' ? state.user.currentStates : state.user.desiredStates
  );

  const handleStateToggle = useCallback((state) => {
    const isSelected = selectedStates.includes(state);
    const action = type === 'current' 
      ? (isSelected ? removeCurrentState : addCurrentState)
      : (isSelected ? removeDesiredState : addDesiredState);
    dispatch(action(state));
  }, [dispatch, selectedStates, type]);

  return (
    <div className="state-selector">
      <div className="state-selector-header" onClick={() => setIsExpanded(!isExpanded)}>
        <label className="question-label">{question}</label>
        <div className="selected-count">
          {selectedStates.length} selected
          <button 
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            ▼
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="state-bubbles-container">
          {options.map(state => (
            <button
              key={state}
              className={`state-bubble ${selectedStates.includes(state) ? 'selected' : ''} ${type}-state`}
              onClick={() => handleStateToggle(state)}
            >
              {state}
            </button>
          ))}
        </div>
      )}
      
      {!isExpanded && selectedStates.length > 0 && showSelectedStates && (
        <div className="selected-states-preview">
          {selectedStates.map(state => (
            <div key={state} className={`state-bubble selected ${type}-state`}>
              {state}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(StateSelector);