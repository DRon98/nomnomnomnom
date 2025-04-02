import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaMinus, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import './PantryManager.css';

const CATEGORIES = ['Protein', 'Carbs', 'Vegetables', 'Fruits', 'Dairy', 'Fats', 'Condiments', 'Spices'];

const PantryManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Get pantry items from Redux store with safety check
  const pantryItems = useSelector(state => state?.inventory?.pantry || []);
  const dispatch = useDispatch();

  const renderQuantityIndicator = (quantity, maxQuantity = 5) => {
    return (
      <div className="quantity-indicator">
        {[...Array(maxQuantity)].map((_, i) => (
          <div
            key={i}
            className={`quantity-segment ${i < quantity ? 'filled' : ''}`}
            style={{ backgroundColor: i < quantity ? getQuantityColor(quantity, maxQuantity) : undefined }}
          />
        ))}
      </div>
    );
  };

  const getQuantityColor = (quantity, maxQuantity) => {
    const ratio = quantity / maxQuantity;
    if (ratio <= 0.2) return '#ef5350';
    if (ratio <= 0.4) return '#ffd54f';
    if (ratio <= 0.6) return '#ffb74d';
    if (ratio <= 0.8) return '#81c784';
    return '#43a047';
  };

  const filteredItems = pantryItems.filter(item => {
    if (!item) return false;
    const matchesSearch = !searchTerm || (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategories.length || (item.category && selectedCategories.includes(item.category));
    return matchesSearch && matchesCategory;
  });

  const handleAddNewItem = () => {
    // TODO: Implement add new item functionality
    console.log('Add new item clicked');
  };

  const handleAddFromGrocery = () => {
    // TODO: Implement add from grocery functionality
    console.log('Add from grocery clicked');
  };

  const handleRefillPrevious = () => {
    // TODO: Implement refill previous functionality
    console.log('Refill previous clicked');
  };

  return (
    <div className="pantry-manager">
      <h1>Pantry Manager</h1>

      <div className="action-buttons">
        <button className="action-btn add-new" onClick={handleAddNewItem}>
          <FaPlus /> Add New Item
        </button>
        <button className="action-btn add-grocery" onClick={handleAddFromGrocery}>
          <FaPlus /> From Grocery List
        </button>
        <button className="action-btn refill" onClick={handleRefillPrevious}>
          <FaPlus /> Refill Previous
        </button>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search pantry items..."
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

      <div className="pantry-table">
        <div className="table-header">
          <div className="header-item">Item</div>
          <div className="header-item">Category</div>
          <div className="header-item">Quantity</div>
          <div className="header-item">Expiration</div>
          <div className="header-item">Actions</div>
        </div>

        <div className="table-body">
          {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id || Math.random()} className="table-row">
                <div className="cell">{item.name || 'Unnamed Item'}</div>
                <div className="cell">{item.category || 'Uncategorized'}</div>
                <div className="cell quantity-cell">
                  {renderQuantityIndicator(item.quantity || 0)}
                </div>
                <div className="cell">
                  {item.expiration ? new Date(item.expiration).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  }) : '-'}
                </div>
                <div className="cell actions">
                  <button className="action-icon">
                    <FaPlus />
                  </button>
                  <button className="action-icon">
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No items in your pantry</p>
              <p className="empty-subtitle">Add items from the grocery list or create new items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantryManager; 