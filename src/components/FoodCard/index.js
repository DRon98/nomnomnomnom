import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd/dist/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { addToPantry, addToGroceries } from '../../store/inventorySlice';
import { Link } from 'react-router-dom';
import './styles.css';

const FoodCard = ({ food, onRemove, inMealPlan = false, isBatchMode = false, isSelected = false, onSelect }) => {
  const dispatch = useDispatch();
  const pantryItems = useSelector(state => state.inventory.pantry) || [];
  const shoppingListItems = useSelector(state => state.inventory.groceries) || [];
  const [isRecipeBase, setIsRecipeBase] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FOOD',
    item: { food: { ...food }, isRecipeBase },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => !isRecipeBase || ingredients.length === 0
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOOD',
    canDrop: (item) => {
      // Can't drop if:
      // 1. Not a recipe base
      // 2. Trying to drop itself
      // 3. Item is a recipe base with ingredients
      return isRecipeBase && 
             item.food.id !== food.id && 
             (!item.isRecipeBase || item.isRecipeBase && !item.ingredients?.length);
    },
    drop: (item) => {
      if (!ingredients.some(ing => ing.id === item.food.id)) {
        setIngredients([...ingredients, item.food]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop()
    })
  }), [isRecipeBase, ingredients, food.id]);

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
    
    if (food.recommendation === 'high') className += ' high';
    if (food.recommendation === 'moderate') className += ' moderate';
    if (food.recommendation === 'avoid') className += ' avoid';
    if (isDragging) className += ' dragging';
    if (inMealPlan) className += ' in-meal-plan';
    if (isBatchMode) className += ' batch-mode';
    if (isSelected) className += ' selected';
    if (isRecipeBase) className += ' recipe-base';
    if (isOver) className += ' drop-target';
    
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

  const handleMakeRecipe = (e) => {
    e.stopPropagation();
    setIsRecipeBase(true);
  };

  const removeIngredient = (ingredientId, e) => {
    e.stopPropagation();
    setIngredients(ingredients.filter(ing => ing.id !== ingredientId));
  };

  // Combine drag and drop refs
  const refCombiner = (el) => {
    drag(el);
    if (isRecipeBase) {
      drop(el);
    }
  };

  const status = getItemStatus();

  return (
    <div ref={refCombiner} className={getCardClass()}>
      {isRecipeBase ? (
        <>
          <div className="recipe-header">
            <div className="food-icon">{food.icon}</div>
            <h3 className="food-name">{food.name}</h3>
            {onRemove && (
              <button 
                className="food-remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(food.id);
                }}
                aria-label={`Remove ${food.name}`}
              >
                ×
              </button>
            )}
          </div>
          <div className="recipe-ingredients">
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="recipe-ingredient">
                <span className="food-icon">{ingredient.icon}</span>
                <button
                  className="remove-button"
                  onClick={(e) => removeIngredient(ingredient.id, e)}
                  title={`Remove ${ingredient.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {ingredients.length > 0 && (
            <Link 
              to={`/recipe-generator?base=${food.id}&ingredients=${ingredients.map(i => i.id).join(',')}`}
              className="generate-recipe-link"
              onClick={(e) => e.stopPropagation()}
            >
              Generate Recipe →
            </Link>
          )}
        </>
      ) : (
        <>
          <div className="food-icon">{food.icon}</div>
          <h3 className="food-name">{food.name}</h3>
          
          {inMealPlan && (
            <>
              <button 
                className="make-recipe-button"
                onClick={handleMakeRecipe}
                title="Make this a recipe base"
              >
                🍳
              </button>
              {onRemove && (
                <button 
                  className="food-remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(food.id);
                  }}
                  aria-label={`Remove ${food.name}`}
                >
                  ×
                </button>
              )}
            </>
          )}

          {!inMealPlan && !isBatchMode && (
            <>
              <p className="food-description">{food.description}</p>
              <div className="food-rating">
                Rating: {getRatingEmoji(food.rating)}
              </div>
              <div className="food-actions">
                <button
                  className="food-action-button pantry"
                  onClick={() => dispatch(addToPantry({ food: { ...food } }))}
                  title="Add to Pantry"
                >
                  + 🗄️
                  {pantryItems.some(item => item.food.id === food.id) && 
                    <span className="food-action-checkmark">✓</span>}
                </button>
                <button
                  className="food-action-button grocery"
                  onClick={() => dispatch(addToGroceries({ food: { ...food } }))}
                  title="Add to Groceries"
                >
                  + 🛒
                  {shoppingListItems.some(item => item.food.id === food.id) && 
                    <span className="food-action-checkmark">✓</span>}
                </button>
              </div>
            </>
          )}
        </>
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
    </div>
  );
};

export default FoodCard;