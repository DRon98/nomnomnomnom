import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setSpiceLevel } from '../../store/surveySlice';

const SPICE_LEVELS = [
  { id: 'mild', label: 'Mild', icon: '🌶️', description: 'Little to no heat' },
  { id: 'medium', label: 'Medium', icon: '🌶️🌶️', description: 'Moderate heat' },
  { id: 'hot', label: 'Hot', icon: '🌶️🌶️🌶️', description: 'Significant heat' },
  { id: 'extra_hot', label: 'Extra Hot', icon: '🌶️🌶️🌶️🌶️', description: 'Very spicy' }
];

const SpiceLevelSelector = () => {
  const dispatch = useDispatch();
  const currentSpiceLevel = useSelector(state => state.survey.spiceLevel);
  
  const handleSelect = (levelId) => {
    dispatch(setSpiceLevel(levelId));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Spice Level Preference</h2>
      <p className="mb-6">
        Select your preferred level of spiciness in your meals.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPICE_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => handleSelect(level.id)}
            className={`p-6 rounded-lg border-2 transition-colors ${
              currentSpiceLevel === level.id
                ? 'border-blue-600 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
            }`}
          >
            <div className="text-4xl mb-3">{level.icon}</div>
            <div className="font-medium text-lg mb-2">{level.label}</div>
            <div className="text-sm text-gray-600">{level.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

SpiceLevelSelector.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

export default SpiceLevelSelector; 