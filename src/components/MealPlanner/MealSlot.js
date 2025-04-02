import React from 'react';
import PropTypes from 'prop-types';
import FoodCard from '../common/FoodCard';
import { MEAL_TYPES } from '../../constants';

const MealSlot = ({
  mealType,
  foods = [],
  onAddFood,
  onRemoveFood,
  className = '',
}) => {
  const handleAddFood = () => {
    // TODO: Implement food selection modal
    onAddFood?.(mealType);
  };

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium capitalize">{mealType}</h3>
        <button
          onClick={handleAddFood}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
        >
          Add Food
        </button>
      </div>

      <div className="space-y-4">
        {foods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            onRemove={() => onRemoveFood?.(mealType, food)}
            isSelected
          />
        ))}
        {foods.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No foods added yet
          </div>
        )}
      </div>
    </div>
  );
};

MealSlot.propTypes = {
  mealType: PropTypes.oneOf(Object.values(MEAL_TYPES)).isRequired,
  foods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      calories: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
    })
  ),
  onAddFood: PropTypes.func,
  onRemoveFood: PropTypes.func,
  className: PropTypes.string,
};

export default MealSlot; 