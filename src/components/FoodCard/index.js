import React from 'react';
import { useDrag } from 'react-dnd/dist/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { addToPantry, addToGroceries } from '../../store/inventorySlice';
import './styles.css';

const FoodCard = ({ food, onRemove, inMealPlan = false, isBatchMode = false, isSelected = false, onSelect }) => {
  const dispatch = useDispatch();
  const pantryItems = useSelector(state => state.inventory.pantry) || [];
  const shoppingListItems = useSelector(state => state.inventory.groceries) || [];
  
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

  const getItemStatus = () => {
    const inPantry = pantryItems.some(item => item.food.id === food.id);
    const inShoppingList = shoppingListItems.some(item => item.food.id === food.id);
    
    if (inPantry) return { text: 'In Pantry', className: 'status-tag pantry' };
    if (inShoppingList) return { text: 'In Shopping List', className: 'status-tag shopping' };
    return { text: 'Need to Purchase', className: 'status-tag need-purchase' };
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

  const status = getItemStatus();

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
        </>
      )}
      
      {!inMealPlan && (
        <div className={status.className}>
          {status.text}
        </div>
      )}
    </div>
  );
};

export default FoodCard;