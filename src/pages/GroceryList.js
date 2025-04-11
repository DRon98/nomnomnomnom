import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaMinus, FaSearch, FaFilter, FaSort, FaShoppingCart, FaArchive, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  removeFromGroceries,
  updateGroceryAmount,
  addToPantry,
  clearGroceries
} from '../store/inventorySlice';
import './GroceryList.css';

const CATEGORIES = ['Protein', 'Carbs', 'Vegetables', 'Fruits', 'Dairy', 'Fats', 'Condiments', 'Spices'];

const GroceryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const groceryItems = useSelector(state => state?.inventory?.groceries || []);
  const dispatch = useDispatch();

  const handleAddCustomItem = () => {
    // TODO: Implement modal for adding custom item
    console.log('Add custom item clicked');
  };

  const handleAddItemsToGroceries = () => {
    // TODO: Implement modal for adding items from food database
    console.log('Add items to groceries clicked');
  };

  const handleMoveSelectedToPantry = () => {
    groceryItems.forEach(item => {
      dispatch(addToPantry({
        food: item.food,
        amount: item.amount
      }));
      dispatch(removeFromGroceries({ foodId: item.foodId }));
    });
  };

  const filteredItems = groceryItems.filter(item => {
    if (!item || !item.food) return false;
    const matchesSearch = !searchTerm || 
      (item.food.name && item.food.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategories.length || 
      (item.food.category && selectedCategories.includes(item.food.category));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grocery-list">
      <h1>Grocery List</h1>

      <div className="action-buttons">
        <button className="action-btn add-custom" onClick={handleAddCustomItem}>
          <FaPlus /> Add Custom Item
        </button>
        <Link to="/add-to-shopping-list" className="action-btn add-items">
          <FaPlus /> Add Items to Shopping List
        </Link>
        <Link to="/add-spices-to-list" className="action-btn spice-cabinet">
          <FaLeaf /> Add Spices to Shopping List
        </Link>
        <button className="action-btn move-to-pantry" onClick={handleMoveSelectedToPantry}>
          <FaArchive /> Add Items to Pantry
        </button>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search grocery items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter <FaFilter />
        </button>
        <button className="sort-btn">
          Sort <FaSort />
        </button>
      </div>

      {showFilters && (
        <div className="category-filters">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`filter-chip ${selectedCategories.includes(category) ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategories(prev => 
                  prev.includes(category) 
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
                );
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grocery-table">
        <div className="table-header">
          <div className="header-item">Item</div>
          <div className="header-item">Category</div>
          <div className="header-item">Quantity</div>
          <div className="header-item">Actions</div>
        </div>

        <div className="table-body">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.foodId} className="table-row">
                <div className="cell">{item.food.name}</div>
                <div className="cell">{item.food.category || 'Uncategorized'}</div>
                <div className="cell quantity-cell">
                  <button 
                    className="quantity-btn"
                    onClick={() => dispatch(updateGroceryAmount({ 
                      foodId: item.foodId, 
                      amount: Math.max(1, item.amount - 1) 
                    }))}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.amount}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => dispatch(updateGroceryAmount({ 
                      foodId: item.foodId, 
                      amount: item.amount + 1 
                    }))}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="cell actions">
                  <button 
                    className="action-icon delete"
                    onClick={() => dispatch(removeFromGroceries({ foodId: item.foodId }))}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No items in your grocery list</p>
              <p className="empty-subtitle">Add items using the buttons above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryList; 