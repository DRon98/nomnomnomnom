import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeFoodFromMeal } from '../../../../store/mealPlanSlice';
import { useMealSlot } from '../../hooks/useMealSlot';
import FoodCard from '../../../food/components/FoodCard';
import './MealSlot.css';

/**
 * MealSlot component that can be used in both simple and complex meal planning scenarios
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the meal slot
 * @param {string} props.icon - Icon for the meal slot
 * @param {string} props.mealType - Type of meal (breakfast, lunch, dinner, snacks)
 * @param {Array} props.foods - Array of food items in the slot
 * @param {string} [props.day] - Day of the week (for weekly view)
 * @param {Function} [props.onCopyToDay] - Callback for copying meals to other days
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.isSimpleView] - Whether to use simple view without drag-drop
 * @param {Function} [props.onAddFood] - Callback for adding food (simple view)
 * @param {Function} [props.onRemoveFood] - Callback for removing food (simple view)
 */
const MealSlot = ({
  title,
  icon,
  mealType,
  foods = [],
  day = null,
  onCopyToDay = null,
  className = '',
  isSimpleView = false,
  onAddFood,
  onRemoveFood
}) => {
  const dispatch = useDispatch();

  // Only use the hook for complex view (drag-drop enabled)
  const {
    isOver,
    drop,
    isEditingTime,
    timeValue,
    handleTimeClick,
    handleTimeChange,
    handleTimeBlur
  } = !isSimpleView ? useMealSlot(mealType, day) : {};

  const handleRemoveFood = (mealId) => {
    if (isSimpleView) {
      onRemoveFood?.(mealType, mealId);
    } else {
      dispatch(removeFoodFromMeal({ mealType, mealId, day }));
    }
  };

  const renderHeader = () => (
    <div className="meal-header">
      <span className="meal-icon">{icon}</span>
      <h3 className="meal-title">{title}</h3>
      
      {!isSimpleView && (
        <>
          {isEditingTime ? (
            <input
              type="time"
              className="meal-time-input"
              value={timeValue}
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              autoFocus
            />
          ) : (
            <span className="meal-time" onClick={handleTimeClick}>
              {timeValue}
            </span>
          )}
        </>
      )}

      {isSimpleView && (
        <button
          onClick={() => onAddFood?.(mealType)}
          className="add-food-button"
        >
          Add Food
        </button>
      )}

      {!isSimpleView && onCopyToDay && foods.length > 0 && (
        <button 
          className="copy-meal-button"
          onClick={() => onCopyToDay()}
        >
          Copy to Other Days
        </button>
      )}
    </div>
  );

  const renderContent = () => {
    if (isSimpleView) {
      return (
        <div className="meal-content">
          {foods.length > 0 ? (
            <div className="meal-foods">
              {foods.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onRemove={() => handleRemoveFood(food.id)}
                  isSelected
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">No foods added yet</div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={drop}
        className={`meal-content droppable ${isOver ? 'active' : ''}`}
      >
        {foods && foods.length > 0 ? (
          <div className="meal-foods">
            {foods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onRemove={() => handleRemoveFood(food.mealId)}
                inMealPlan={true}
              />
            ))}
          </div>
        ) : (
          <div className="drag-placeholder">
            {isSimpleView ? 'No foods added yet' : 'Drag a food here'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`meal-slot ${className} ${isSimpleView ? 'simple-view' : ''}`}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

MealSlot.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  mealType: PropTypes.string.isRequired,
  foods: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    mealId: PropTypes.string,
  })),
  day: PropTypes.string,
  onCopyToDay: PropTypes.func,
  className: PropTypes.string,
  isSimpleView: PropTypes.bool,
  onAddFood: PropTypes.func,
  onRemoveFood: PropTypes.func,
};

export default React.memo(MealSlot); 