import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDietaryRestriction } from '../../store/surveySlice';

const DIETARY_RESTRICTIONS = [
  { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', name: 'Vegan', icon: '🌱' },
  { id: 'gluten_free', name: 'Gluten Free', icon: '🌾' },
  { id: 'dairy_free', name: 'Dairy Free', icon: '🥛' },
  { id: 'nut_free', name: 'Nut Free', icon: '🥜' },
  { id: 'halal', name: 'Halal', icon: '🕌' },
  { id: 'kosher', name: 'Kosher', icon: '✡️' },
  { id: 'low_carb', name: 'Low Carb', icon: '🍚' },
  { id: 'low_fat', name: 'Low Fat', icon: '🥑' },
  { id: 'low_sodium', name: 'Low Sodium', icon: '🧂' },
  { id: 'keto', name: 'Keto', icon: '🥑' },
  { id: 'paleo', name: 'Paleo', icon: '🥩' }
];

const DietaryRestrictionsSelector = () => {
  const dispatch = useDispatch();
  const selectedRestrictions = useSelector(state => state.survey.dietaryRestrictions);
  
  const handleToggle = (restrictionId) => {
    dispatch(toggleDietaryRestriction(restrictionId));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dietary Restrictions</h2>
      <p className="mb-6">
        Select any dietary restrictions or preferences that apply to you.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {DIETARY_RESTRICTIONS.map((restriction) => (
          <button
            key={restriction.id}
            onClick={() => handleToggle(restriction.id)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedRestrictions.includes(restriction.id)
                ? 'border-blue-600 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
            }`}
          >
            <div className="text-3xl mb-2">{restriction.icon}</div>
            <div className="font-medium">{restriction.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DietaryRestrictionsSelector; 