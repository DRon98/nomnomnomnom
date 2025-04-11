import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToGroceries } from '../store/inventorySlice';
import Selector from '../components/Selector';
import { PANTRY_CATEGORIES } from './AddToPantry'; // Reuse the same categories

const AddToShoppingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleComplete = (selections) => {
    // Add all selected items to shopping list
    Object.entries(selections).forEach(([category, items]) => {
      items.forEach(item => {
        dispatch(addToGroceries({
          food: {
            id: item.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            name: item,
            category: PANTRY_CATEGORIES[category].title,
            unit: 'unit'
          },
          amount: 1
        }));
      });
    });
    navigate('/grocery-list');
  };

  return (
    <Selector
      categories={PANTRY_CATEGORIES}
      onComplete={handleComplete}
      onBack={() => navigate('/grocery-list')}
      title="Add Items to Shopping List"
      completeButtonText="Add to Shopping List"
    />
  );
};

export default AddToShoppingList; 