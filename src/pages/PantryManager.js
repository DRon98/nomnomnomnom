import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaSearch, FaFilter, FaSort, FaLeaf, FaSync } from 'react-icons/fa';
import { updatePantryAmount } from '../store/inventorySlice';
import './PantryManager.css';
import { useFoods } from '../hooks/useFoods';
import { getCurrentUserId } from '../utils/auth';
import { useInventory } from '../hooks/useInventory';
const CATEGORIES = ['Protein', 'Carbs', 'Vegetables', 'Fruits', 'Dairy', 'Fats', 'Condiments', 'Spices'];

const PantryManager = () => {
  const { data: foods, isLoading, error } = useFoods();
  console.log("foods",foods)
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userId, setUserId] = useState(null);
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

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const { data: pantrydata, isLoading: pantryLoading, error: pantryError } = useInventory(userId, 'pantry');
    console.log("pantrydata", pantrydata)

  const getQuantityColor = (quantity, maxQuantity) => {
    const ratio = quantity / maxQuantity;
    if (ratio <= 0.2) return '#ef5350';
    if (ratio <= 0.4) return '#ffd54f';
    if (ratio <= 0.6) return '#ffb74d';
    if (ratio <= 0.8) return '#81c784';
    return '#43a047';
  };

  const filteredItems = pantryItems.filter(item => {
    if (!item || !item.food) return false;
    const matchesSearch = !searchTerm || (item.food.name && item.food.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategories.length || (item.food.category && selectedCategories.includes(item.food.category));
    
    if (matchesSearch && matchesCategory) {
      console.log('Pantry Manager:', {
        pantry: pantryItems.map(item => ({
          foodId: item.foodId,
          name: item.food.name,
          amount: item.amount,
          unit: item.food.unit || 'unit',
          category: item.food.category,
          addedDate: new Date().toISOString().split('T')[0]
        }))
      });
    }
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
        <button className="action-btn primary-action" onClick={handleAddNewItem}>
          <FaPlus /> Add New Item
        </button>
        <button className="action-btn secondary-action" onClick={handleAddFromGrocery}>
          <FaPlus /> From Grocery List
        </button>
        <button className="action-btn secondary-action" onClick={handleRefillPrevious}>
          <FaSync /> Refill Previous Items
        </button>
        <Link to="/add-to-pantry" className="action-btn primary-action">
          <FaPlus /> Add Items to Pantry
        </Link>
        <Link to="/spice-cabinet-builder" className="action-btn secondary-action">
          <FaLeaf /> Build Spice Cabinet
        </Link>
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
          {pantrydata?.items?.map(item => (
              <div key={item.id} className="table-row">
                <div className="cell">{item.name}</div>
                <div className="cell">{item.unit}</div>
                <div className="cell quantity-cell">{item.quantity}</div>
                <div className="cell">{item.expiration_date || '-'}</div>
                <div className="cell actions">
                  <button 
                    className="action-icon"
                    onClick={() => dispatch(updatePantryAmount({ 
                      inventoryId: item.id,
                      foodId: item.food_id, 
                      amount: item.quantity + 1 
                    }))}
                  >
                    <FaPlus />
                  </button>
                  <button 
                    className="action-icon"
                    onClick={() => dispatch(updatePantryAmount({ 
                      inventoryId: item.id,
                      foodId: item.food_id, 
                      amount: Math.max(0.1, item.quantity - 1) 
                    }))}
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>    
            ))}
        </div>
      </div>
    </div>
  );
};

export default PantryManager;