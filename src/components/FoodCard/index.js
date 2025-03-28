import React from 'react';
import { useDrag } from 'react-dnd';
import './styles.css';

const FoodCard = ({ food, onRemove, inMealPlan = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FOOD',
    item: { food },
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
    switch (food.recommendation) {
      case 'high':
        return 'food-card high';
      case 'moderate':
        return 'food-card moderate';
      case 'avoid':
        return 'food-card avoid';
      default:
        return 'food-card';
    }
  };

  return (
    <div
      ref={drag}
      className={`${getCardClass()} ${isDragging ? 'dragging' : ''} ${inMealPlan ? 'in-meal-plan' : ''}`}
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
      <div className="food-icon">{food.icon}</div>
      <h3 className="food-name">{food.name}</h3>
      <p className="food-description">{food.description}</p>
      <div className="food-rating">
        {food.rating} {getRatingEmoji(food.rating)}
      </div>
    </div>
  );
};

export default FoodCard; 