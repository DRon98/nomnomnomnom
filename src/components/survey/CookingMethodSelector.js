import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCookingMethod } from '../../store/surveySlice';

const CookingMethodSelector = ({ category, methods }) => {
  const dispatch = useDispatch();
  const selectedMethods = useSelector(state => state.survey.cookingMethods[category]);
  
  const handleToggle = (methodId) => {
    dispatch(toggleCookingMethod({ category, methodId }));
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => handleToggle(method.id)}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedMethods.includes(method.id)
              ? 'border-blue-600 bg-blue-50 text-blue-800'
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
          }`}
        >
          <div className="text-3xl mb-2">{method.icon}</div>
          <div className="font-medium">{method.name}</div>
        </button>
      ))}
    </div>
  );
};

CookingMethodSelector.propTypes = {
  category: PropTypes.string.isRequired,
  methods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CookingMethodSelector; 