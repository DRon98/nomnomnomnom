import React, { memo } from 'react';
import PropTypes from 'prop-types';

const FoodCard = memo(({
  food,
  onSelect,
  onRemove,
  isSelected = false,
  className = '',
}) => {
  const handleClick = () => {
    if (isSelected) {
      onRemove?.(food);
    } else {
      onSelect?.(food);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{food.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{food.category}</p>
        </div>
        {food.image && (
          <img
            src={food.image}
            alt={food.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>Calories: {food.calories}</p>
        <p>Protein: {food.protein}g</p>
        <p>Carbs: {food.carbs}g</p>
        <p>Fat: {food.fat}g</p>
      </div>
    </div>
  );
});

FoodCard.propTypes = {
  food: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    calories: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
};

FoodCard.displayName = 'FoodCard';

export default FoodCard; 