import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  removeFromPantry,
  updatePantryAmount,
  removeFromGroceries,
  updateGroceryAmount,
  clearGroceries,
  clearPantry
} from '../../store/inventorySlice';
import './styles.css';

const InventoryItem = ({ item, onUpdateAmount, onRemove, onAddToRecipe, showAddToRecipe }) => {
  return (
    <div className="inventory-item">
      <div className="inventory-item-info">
        <span className="inventory-item-icon">{item.food.icon}</span>
        <span className="inventory-item-name">
          {item.food.name}
        </span>
      </div>
      <div className="inventory-item-actions">
        <input
          type="number"
          min="1"
          value={item.amount}
          onChange={(e) => onUpdateAmount(item.foodId, parseInt(e.target.value, 10))}
          className="narrow-amount-input"
        />
        <select className="unit-select">
          <option value="oz">oz</option>
          <option value="g">g</option>
          <option value="lb">lb</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="cup">cup</option>
        </select>
        {showAddToRecipe && (
          <button
            onClick={() => onAddToRecipe({
              name: item.food.name,
              unit: item.food.unit || 'unit'
            })}
            className="add-to-recipe-button"
            aria-label={`Add ${item.food.name} to recipe`}
          >
            +
          </button>
        )}
        <button
          onClick={() => onRemove(item.foodId)}
          className="remove-item-button"
          aria-label={`Remove ${item.food.name}`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const InventoryDropdowns = ({ 
  showPantry = true, 
  showShoppingList = true, 
  showSpicesCabinet = false, 
  showHeader = true,
  enableAddToRecipe = false,
  onAddIngredient = null
}) => {
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [isGroceriesOpen, setIsGroceriesOpen] = useState(false);
  const [isSpicesOpen, setIsSpicesOpen] = useState(false);
  const dispatch = useDispatch();
  const pantryItems = useSelector(state => state.inventory.pantry);
  const groceryItems = useSelector(state => state.inventory.groceries);

  const handleUpdatePantryAmount = (foodId, amount) => {
    if (amount > 0) {
      dispatch(updatePantryAmount({ foodId, amount }));
    }
  };

  const handleUpdateGroceryAmount = (foodId, amount) => {
    if (amount > 0) {
      dispatch(updateGroceryAmount({ foodId, amount }));
    }
  };

  // Filtered lists
  const pantryNonSpices = pantryItems.filter(item => item.food.category !== 'Spices & Seasonings');
  const pantrySpices = pantryItems.filter(item => item.food.category == 'Spices & Seasonings');
 
  return (
    <div className="inventory-dropdowns">
      {showPantry && (
        <div className="inventory-dropdown">
          <button
            className={`inventory-button ${isPantryOpen ? 'active' : ''}`}
            onClick={() => setIsPantryOpen(!isPantryOpen)}
          >
            My Pantry
          </button>
          {isPantryOpen && (
            <div className="dropdown-content">
              {showHeader && (
                <div className="dropdown-header">
                  <div>My Pantry</div>
                  <button
                    onClick={() => dispatch(clearPantry())}
                    className="clear-button"
                  >
                    Clear All
                  </button>
                </div>
              )}
              <div className="dropdown-link">
                <Link to="/pantry" className="inventory-link">Go to Pantry Manager</Link>
              </div>
              <div className="items-list">
                {pantryNonSpices.length > 0 ? (
                  pantryNonSpices.map(item => (
                    <InventoryItem
                      key={item.foodId}
                      item={item}
                      onUpdateAmount={handleUpdatePantryAmount}
                      onRemove={(foodId) => dispatch(removeFromPantry({ foodId }))}
                      showAddToRecipe={enableAddToRecipe}
                      onAddToRecipe={onAddIngredient}
                    />
                  ))
                ) : (
                  <div className="empty-message">Your pantry is empty</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {showShoppingList && (
        <div className="inventory-dropdown">
          <button
            className={`inventory-button ${isGroceriesOpen ? 'active' : ''}`}
            onClick={() => setIsGroceriesOpen(!isGroceriesOpen)}
          >
            My Shopping List
          </button>
          {isGroceriesOpen && (
            <div className="dropdown-content">
              {showHeader && (
                <div className="dropdown-header">
                  <h3>My Shopping List</h3>
                  <button
                    onClick={() => dispatch(clearGroceries())}
                    className="clear-button"
                  >
                    Clear All
                  </button>
                </div>
              )}
              <div className="dropdown-link">
                <Link to="/grocery-list" className="inventory-link">Go to Grocery List</Link>
              </div>
              <div className="items-list">
                {groceryItems.length > 0 ? (
                  groceryItems.map(item => (
                    <InventoryItem
                      key={item.foodId}
                      item={item}
                      onUpdateAmount={handleUpdateGroceryAmount}
                      onRemove={(foodId) => dispatch(removeFromGroceries({ foodId }))}
                      showAddToRecipe={enableAddToRecipe}
                      onAddToRecipe={onAddIngredient}
                    />
                  ))
                ) : (
                  <div className="empty-message">Your shopping list is empty</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {showSpicesCabinet && (
        <div className="inventory-dropdown">
          <button
            className={`inventory-button ${isSpicesOpen ? 'active' : ''}`}
            onClick={() => setIsSpicesOpen(!isSpicesOpen)}
          >
            Spices and Sauce Cabinet
          </button>
          {isSpicesOpen && (
            <div className="dropdown-content">
              {showHeader && (
                <div className="dropdown-header">
                  <h3>Spices and Sauce Cabinet</h3>
                </div>
              )}
              <div className="dropdown-link">
                <Link to="/spice-cabinet-builder" className="inventory-link">Go to Spice Cabinet Builder</Link>
              </div>
              <div className="items-list">
                {pantrySpices.length > 0 ? (
                  pantrySpices.map(item => (
                    <InventoryItem
                      key={item.foodId}
                      item={item}
                      onUpdateAmount={handleUpdatePantryAmount}
                      onRemove={(foodId) => dispatch(removeFromPantry({ foodId }))}
                      showAddToRecipe={enableAddToRecipe}
                      onAddToRecipe={onAddIngredient}
                    />
                  ))
                ) : (
                  <div className="empty-message">Your spice cabinet is empty</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryDropdowns;