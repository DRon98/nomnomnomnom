import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { setCurrentState, setDesiredState } from '../../store/userSlice';
import './styles.css';

const StateSelector = ({ type, options, question }) => {
  const dispatch = useDispatch();
  const selectedState = useSelector(state => 
    type === 'current' ? state.user.currentState : state.user.desiredState
  );

  const handleStateChange = (selected) => {
    const action = type === 'current' ? setCurrentState : setDesiredState;
    dispatch(action(selected.value));
  };

  const selectOptions = options.map(option => ({
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
      />
      {selectedState && (
        <div className={`state-bubble ${type}-state`}>
          {selectedState}
        </div>
      )}
    </div>
  );
};

export default StateSelector; 