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
  const [showIngredients, setShowIngredients] = useState(false);
  
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
    if (showIngredients) className += ' show-ingredients';
    
    return className;
  };

  const getItemStatus = () => {
    const inPantry = pantryItems.some(item => item.food.id === food.id);
    const inShoppingList = shoppingListItems.some(item => item.food.id === food.id);
    
    if (inPantry) return { text: 'In Pantry', className: 'status-tag pantry' };
    if (inShoppingList) return { text: 'In Shopping List', className: 'status-tag shopping' };
    return { text: 'Need to Purchase', className: 'status-tag need-purchase' };
  };

  const handleAddToPantry = (e) => {
    e.stopPropagation();
    if (food.base_ingredients_for_grocery_list && food.base_ingredients_for_grocery_list.length > 0) {
      food.base_ingredients_for_grocery_list.forEach(ingredient => {
        dispatch(addToPantry({
          food: {
            id: `${food.id}_${ingredient}`,
            name: ingredient,
            category: food.category || 'other',
            unit: 'unit'
          }
        }));
      });
    } else {
      dispatch(addToPantry({ food: { ...food } }));
    }
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
    <div ref={refCombiner} className={getCardClass()} onClick={handleClick}>
      {/* <div className="food-icon">{food.emoji || food.icon}</div> */}
      <h3 className="food-name">{food.name}</h3>
      
      {!inMealPlan && !isBatchMode && (
        <>
          <p className="food-description">{food.description}</p>
          
          {food.base_ingredients_for_grocery_list && food.base_ingredients_for_grocery_list.length > 0 && (
            <div className="ingredients-section">
              <button 
                className="toggle-ingredients-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIngredients(!showIngredients);
                }}
              >
                {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'} 
                {showIngredients ? '▼' : '▶'}
              </button>
              
              {showIngredients && (
                <div className="ingredients-list">
                  <h4>Base Ingredients:</h4>
                  <ul>
                    {food.base_ingredients_for_grocery_list.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          
          <div className="food-actions">
            <button
              className="food-action-button pantry"
              onClick={handleAddToPantry}
              title={food.base_ingredients_for_grocery_list ? 'Add' : 'Add to Pantry'}
            >
              🏠 {food.base_ingredients_for_grocery_list ? 'Add ' : 'Add to Pantry'}
            </button>
            <button
              className="food-action-button groceries"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToGroceries();
              }}
              title={food.base_ingredients_for_grocery_list ? 'Shopping List' : 'Add to Shopping List'}
            >
              🛒 {food.base_ingredients_for_grocery_list ? 'Add' : 'Add to List'}
            </button>
          </div>
{/*           
          <div className={status.className}>{status.text}</div> */}
        </>
      )}

      {inMealPlan && food.base_ingredients_for_grocery_list && food.base_ingredients_for_grocery_list.length > 0 && (
        <Link 
          to={`/recipe-generator?ingredients=${encodeURIComponent(food.base_ingredients_for_grocery_list.join(','))}`}
          className="view-recipe-link"
          onClick={(e) => e.stopPropagation()}
        >
          Build Recipe
        </Link>
      )}

      {onRemove && (
        <button className="remove-button" onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}>
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
    </div>
  );
};

export default FoodCard;