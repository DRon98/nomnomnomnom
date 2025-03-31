import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
  addCurrentState,
  removeCurrentState,
  addDesiredState,
  removeDesiredState
} from '../../store/userSlice';
import './styles.css';

const StateSelector = ({ type, options, question, onStateSelect, showSelectedStates = true }) => {
  const dispatch = useDispatch();
  const selectedStates = useSelector(state => 
    type === 'current' ? state.user.currentStates : state.user.desiredStates
  );

  const handleStateChange = (selected) => {
    if (!selected) return;
    
    const action = type === 'current' ? addCurrentState : addDesiredState;
    dispatch(action(selected.value));

    // If this is a desired state and we have an onStateSelect callback, call it
    if (type === 'desired' && onStateSelect) {
      onStateSelect(selected.value);
    }
  };

  const handleRemoveState = (stateToRemove) => {
    const action = type === 'current' ? removeCurrentState : removeDesiredState;
    dispatch(action(stateToRemove));
  };

  const selectOptions = options
    .filter(option => !selectedStates.includes(option))
    .map(option => ({
      value: option,
      label: option
    }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '5px',
      border: '1px solid #ddd',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #3498db'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3498db' : state.isFocused ? '#ebf5fb' : 'white',
      color: state.isSelected ? 'white' : '#333'
    })
  };

  return (
    <div className="state-selector">
      <label className="question-label">{question}</label>
      <Select
        options={selectOptions}
        onChange={handleStateChange}
        placeholder="Select a state"
        isSearchable
        className="state-dropdown"
        styles={customStyles}
        value={null}
        data-testid="state-selector"
      />
      {showSelectedStates && (
        <div className="state-bubbles">
          {selectedStates.map(state => (
            <div key={state} className={`state-bubble ${type}-state`}>
              {state}
              <button 
                className="remove-state"
                onClick={() => handleRemoveState(state)}
                aria-label={`Remove ${state}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StateSelector;