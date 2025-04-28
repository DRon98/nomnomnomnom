import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToGroceries } from '../store/inventorySlice';
import Selector from '../components/Selector';
import { SPICE_CATEGORIES } from './SpiceCabinetBuilder'; // Reuse spice categories

const AddSpicesToList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleComplete = (selections) => {
    // Add all selected spices to shopping list
    Object.entries(selections).forEach(([category, items]) => {
      items.forEach(item => {
        dispatch(addToGroceries({
          food: {
            id: item.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            name: item,
            category: SPICE_CATEGORIES[category].title,
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
    inventoryType="spice_cabinet"
      onComplete={handleComplete}
      onBack={() => navigate('/grocery-list')}
      title="Add Spices & Seasonings to Shopping List"
      completeButtonText="Add to Shopping List"
    />
  );
};

export default AddSpicesToList; 