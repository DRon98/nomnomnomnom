import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFoodPreference } from '../../store/surveySlice';

const FoodPreferenceSelector = ({ category, items }) => {
  const dispatch = useDispatch();
  const selectedFoods = useSelector(state => state.survey.foodPreferences[category]);
  
  const handleToggle = (foodId) => {
    dispatch(toggleFoodPreference({ category, foodId }));
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleToggle(item.id)}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedFoods.includes(item.id)
              ? 'border-blue-600 bg-blue-50 text-blue-800'
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
          }`}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="font-medium">{item.name}</div>
        </button>
      ))}
    </div>
  );
};

FoodPreferenceSelector.propTypes = {
  category: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired
};

export default FoodPreferenceSelector; 