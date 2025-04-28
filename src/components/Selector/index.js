import React, { useState, useEffect, useMemo } from 'react';
import { FaCheck, FaSearch, FaTimes } from 'react-icons/fa';
import './styles.css';
import { useFoods } from '../../hooks/useFoods'; 
import { useInventory } from '../../hooks/useInventory';
import { getCurrentUserId, getAuthToken } from '../../utils/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


const API_URL = 'http://localhost:8000/api/v1';

const Selector = ({ 
  inventoryType,
  categories,
  onComplete,
  onBack,
  title = "Select Items",
  completeButtonText = "Complete Selection"
}) => {
  const [activeTab, setActiveTab] = useState('Object.keys(categories)[0]');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [userId, setUserId] = useState(null);
  const queryClient = useQueryClient();
  const token = getAuthToken();
  console.log("token", token)
  const updateInventoryMutation = useMutation({
    mutationFn: async (updateData) => {
      const token = await getAuthToken();
      const response = await axios.put(
        `${API_URL}/users/${userId}/inventories/${inventoryType}/bulk`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      //`${API_URL}/users/${userId}/inventories/${inv_type}/bulk`
      return response.data;
    },
    onMutate: async (updateData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['inventory', userId, inventoryType]);
      
      // Snapshot the previous value
      const previousInventory = queryClient.getQueryData(['inventory', userId, inventoryType]);
      console.log("previousInventory", previousInventory);

      // Optimistically update the cache
      queryClient.setQueryData(['inventory', userId, inventoryType], (old) => {
        if (!old) return { items: updateData.items };
        if (!old.items) return { ...old, items: updateData.items };
        return { ...old, items: [...old.items, ...updateData.items] };
      });

      return { previousInventory };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousInventory) {
        queryClient.setQueryData(['inventory', userId, inventoryType], context.previousInventory);
      }
      console.error('Error updating inventory:', error);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['inventory', userId,inventoryType]);
      console.log('Successfully updated inventory:', data);
    },
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const { data: foods, isLoading, error } = useFoods();
  console.log("invvv", inventoryType)
  const { data: pantrydata, isLoading: pantryLoading, error: pantryError } = useInventory(userId, inventoryType);
  console.log("paentrydata", pantrydata)
  const handleSelect = (food) => {
    const existingPantryItem = pantrydata?.items?.find(item => item.food_id === food.id);
    
    if (existingPantryItem) {
      // Toggle removal state for pantry items
      setItemsToRemove(prev => {
        const isMarkedForRemoval = prev.some(id => id === existingPantryItem.id);
        if (isMarkedForRemoval) {
          return prev.filter(id => id !== existingPantryItem.id);
        } else {
          return [...prev, existingPantryItem.id];
        }
      });
      // Remove from selectedItems if it was somehow there
      setSelectedItems(prev => prev.filter(item => item.food_id !== food.id));
    } else {
      // Only handle selection if item is not in pantry
      setSelectedItems(prev => {
        const isSelected = prev.some(item => item.food_id === food.id);
        if (isSelected) {
          return prev.filter(item => item.food_id !== food.id);
        } else {
          const newItem = {
            food_id: food.id,
            name: food.name,
            quantity: 1.0,
            unit: food.unit || 'unit',
            expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            added_date: new Date().toISOString().split('T')[0]
          };
          return [...prev, newItem];
        }
      });
    }
  };

  const isItemMarkedForRemoval = (foodId) => {
    const pantryItem = pantrydata?.items?.find(item => item.food_id === foodId);
    return pantryItem && itemsToRemove.includes(pantryItem.id);
  };

  const handleComplete = async () => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }
    console.log("selectedItems", selectedItems);
    const payload = {
      items: selectedItems.map(item => ({
        name: item.name,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        food_id: item.food_id
      })),
      remove_items: itemsToRemove
    };

    try {
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      await updateInventoryMutation.mutateAsync(payload);
      if (onComplete) {
        onComplete(payload);
      }
      // Reset states after successful update
      setItemsToRemove([]);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const getTotalSelectedCount = () => {
    return selectedItems.length + itemsToRemove.length;
  };

  const isItemInPantry = (foodId) => {
    return pantrydata?.items?.some(item => item.food_id === foodId) || false;
  };

  const isItemSelected = (foodId) => {
    return selectedItems.some(item => item.food_id === foodId);
  };

  return (
    <div className="selector">
      <div className="header-section">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <FaCheck /> Back
          </button>
        )}
        <h1>{title}</h1>
        <div className="selected-count">
          {getTotalSelectedCount()} items selected
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search all items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {foods?.map(food => (
            <button
              key={food.id}
              className={`tab-button ${activeTab === food.category ? 'active' : ''}`}
              onClick={() => setActiveTab(food.category)}
            >
              {food.category}
              {(isItemSelected(food.id) || isItemMarkedForRemoval(food.id)) && (
                <span className="selection-badge">
                  {selectedItems.filter(item => item.food_id === food.id).length + 
                   (isItemMarkedForRemoval(food.id) ? 1 : 0)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="tab-content">
          <div className="options-grid">
            {foods?.map(food => (
              <button
                key={food.id}
                className={`option-bubble 
                  ${isItemSelected(food.id) ? 'selected' : ''} 
                  ${isItemInPantry(food.id) && !isItemMarkedForRemoval(food.id) ? 'in-pantry' : ''} 
                  ${isItemMarkedForRemoval(food.id) ? 'marked-for-removal' : ''}`}
                onClick={() => handleSelect(food)}
              >
                {food.name}
                {(isItemSelected(food.id) || (isItemInPantry(food.id) && !isItemMarkedForRemoval(food.id)) || isItemMarkedForRemoval(food.id)) && 
                  <FaCheck className="check-icon" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-actions">
        <button 
          className="complete-button"
          onClick={handleComplete}
          disabled={getTotalSelectedCount() === 0 || updateInventoryMutation.isPending}
        >
          {updateInventoryMutation.isPending ? 'Updating...' : `${completeButtonText} (${getTotalSelectedCount()})`}
        </button>
      </div>
    </div>
  );
};

export default Selector; 