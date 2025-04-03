import React from 'react';
import { useDrag } from 'react-dnd/dist/hooks';
import { useDispatch } from 'react-redux';
import { addToPantry, addToGroceries } from '../../store/inventorySlice';
import './styles.css';

const FoodCard = ({ food, onRemove, inMealPlan = false, isBatchMode = false, isSelected = false, onSelect, status }) => {
  const dispatch = useDispatch();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FOOD',
    item: { food: { ...food } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const getRatingEmoji = (rating) => {
    switch (rating) {
      case 'Nomnomnomnom':
        return '😋😋😋😋';
      case 'Nom':
        return '😋';
      case 'Nono':
        return '🚫';
      default:
        return '';
    }
  };

  const getCardClass = () => {
    let className = 'food-card';
    
    switch (food.recommendation) {
      case 'high':
        className += ' high';
        break;
      case 'moderate':
        className += ' moderate';
        break;
      case 'avoid':
        className += ' avoid';
        break;
    }

    if (isDragging) className += ' dragging';
    if (inMealPlan) className += ' in-meal-plan';
    if (isBatchMode) className += ' batch-mode';
    if (isSelected) className += ' selected';
    
    return className;
  };

  const handleAddToPantry = () => {
    dispatch(addToPantry({ food: { ...food } }));
  };

  const handleAddToGroceries = () => {
    dispatch(addToGroceries({ food: { ...food } }));
  };

  const handleClick = () => {
    if (isBatchMode && onSelect) {
      onSelect();
    }
  };

  // Use drag ref
  const refCombiner = (el) => {
    drag(el);
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'pantry':
        return <span className="status-indicator pantry">🗄️ In Pantry</span>;
      case 'shopping':
        return <span className="status-indicator shopping">🛒 In Shopping List</span>;
      case 'need':
        return <span className="status-indicator need">➕ Need to Purchase</span>;
      default:
        return null;
    }
  };

  return (
    <div
      ref={refCombiner}
      className={getCardClass()}
      onClick={handleClick}
    >
      {inMealPlan && onRemove && (
        <button 
          className="food-remove-button"
          onClick={() => onRemove(food.id)}
          aria-label={`Remove ${food.name}`}
        >
          ×
        </button>
      )}
      
      {isBatchMode && (
        <div className="food-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.()}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="food-icon">{food.icon}</div>
      
      {!inMealPlan && !isBatchMode && (
        <div className="food-actions">
          <button
            className="food-action-button pantry"
            onClick={handleAddToPantry}
            title="Add to Pantry"
          >
            + 🗄️
          </button>
          <button
            className="food-action-button grocery"
            onClick={handleAddToGroceries}
            title="Add to Groceries"
          >
            + 🛒
          </button>
        </div>
      )}
      
      <h3 className="food-name">{food.name}</h3>
      {!inMealPlan && (
        <>
          <p className="food-description">{food.description}</p>
          <div className="food-rating">
            Rating: {getRatingEmoji(food.rating)}
          </div>
          {getStatusIndicator()}
        </>
      )}
    </div>
  );
};

export default FoodCard;