import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaBlender, FaUtensils, FaFire, FaCoffee } from 'react-icons/fa';
import { toggleAppliance, toggleCategory } from '../store/kitchenAppliancesSlice';
import './KitchenAppliances.css';

const APPLIANCE_CATEGORIES = {
  basics: {
    icon: <FaUtensils />,
    title: 'Basic Equipment',
    items: [
      'Cutting Board',
      'Chef\'s Knife',
      'Measuring Cups',
      'Measuring Spoons',
      'Mixing Bowls',
      'Colander',
      'Can Opener'
    ]
  },
  cooking: {
    icon: <FaFire />,
    title: 'Cooking',
    items: [
      'Stovetop',
      'Oven',
      'Microwave',
      'Air Fryer',
      'Slow Cooker',
      'Pressure Cooker',
      'Rice Cooker',
      'Toaster Oven'
    ]
  },
  prep: {
    icon: <FaBlender />,
    title: 'Prep & Processing',
    items: [
      'Food Processor',
      'Blender',
      'Stand Mixer',
      'Hand Mixer',
      'Immersion Blender',
      'Food Scale',
      'Box Grater'
    ]
  },
  specialty: {
    icon: <FaCoffee />,
    title: 'Specialty',
    items: [
      'Coffee Maker',
      'Electric Kettle',
      'Waffle Maker',
      'Ice Cream Maker',
      'Dehydrator',
      'Sous Vide',
      'Deep Fryer'
    ]
  }
};

const KitchenAppliances = () => {
  const dispatch = useDispatch();
  const selectedAppliances = useSelector(state => state.kitchenAppliances.selectedAppliances);

  const handleToggleAppliance = (appliance, category) => {
    dispatch(toggleAppliance({ appliance: appliance.toLowerCase(), category }));
  };

  const handleToggleCategory = (category) => {
    dispatch(toggleCategory({
      category,
      items: APPLIANCE_CATEGORIES[category].items.map(item => item.toLowerCase())
    }));
  };

  const handleSubmit = () => {
    console.log('Kitchen Appliances Survey Responses:', {
      kitchenAppliances: selectedAppliances
    });
  };

  const isApplianceSelected = (appliance, category) => {
    return selectedAppliances[category].includes(appliance.toLowerCase());
  };

  const isCategoryFullySelected = (category) => {
    const items = APPLIANCE_CATEGORIES[category].items.map(item => item.toLowerCase());
    return items.every(item => selectedAppliances[category].includes(item));
  };

  const hasSelectedAppliances = Object.values(selectedAppliances).some(category => category.length > 0);

  return (
    <div className="kitchen-appliances">
      <h2>My Kitchen Appliances</h2>
      <div className="appliance-categories">
        {Object.entries(APPLIANCE_CATEGORIES).map(([key, category]) => (
          <div key={key} className="category-section">
            <div className="category-header">
              <div className="category-title">
                {category.icon}
                <h3>{category.title}</h3>
              </div>
              <button
                className={`select-all-btn ${
                  isCategoryFullySelected(key) ? 'all-selected' : ''
                }`}
                onClick={() => handleToggleCategory(key)}
              >
                {isCategoryFullySelected(key) ? 'Remove All' : 'Select All'}
              </button>
            </div>
            <div className="appliance-bubbles">
              {category.items.map(item => (
                <button
                  key={item}
                  className={`appliance-bubble ${
                    isApplianceSelected(item, key) ? 'selected' : ''
                  }`}
                  onClick={() => handleToggleAppliance(item, key)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button 
        className="submit-button"
        onClick={handleSubmit}
        disabled={!hasSelectedAppliances}
      >
        Submit Kitchen Appliances
      </button>
    </div>
  );
};

export default KitchenAppliances; 