import React, { useState } from 'react';
import { FaBlender, FaUtensils, FaFire, FaCoffee } from 'react-icons/fa';
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
  const [selectedAppliances, setSelectedAppliances] = useState(new Set());

  const toggleAppliance = (appliance) => {
    setSelectedAppliances(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appliance)) {
        newSet.delete(appliance);
      } else {
        newSet.add(appliance);
      }
      return newSet;
    });
  };

  const toggleCategory = (category) => {
    setSelectedAppliances(prev => {
      const newSet = new Set(prev);
      const items = APPLIANCE_CATEGORIES[category].items;
      const allSelected = items.every(item => prev.has(item));
      
      if (allSelected) {
        // Remove all items in category
        items.forEach(item => newSet.delete(item));
      } else {
        // Add all items in category
        items.forEach(item => newSet.add(item));
      }
      return newSet;
    });
  };

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
                  category.items.every(item => selectedAppliances.has(item))
                    ? 'all-selected'
                    : ''
                }`}
                onClick={() => toggleCategory(key)}
              >
                {category.items.every(item => selectedAppliances.has(item))
                  ? 'Remove All'
                  : 'Select All'}
              </button>
            </div>
            <div className="appliance-bubbles">
              {category.items.map(item => (
                <button
                  key={item}
                  className={`appliance-bubble ${
                    selectedAppliances.has(item) ? 'selected' : ''
                  }`}
                  onClick={() => toggleAppliance(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenAppliances; 