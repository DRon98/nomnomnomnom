import React, { useState, useEffect } from 'react';
import './FoodSurvey.css';

// Food icons for categories
const FOOD_CATEGORIES = [
  {
    name: 'Proteins',
    items: [
      { id: 'chicken', name: 'Chicken', icon: '🍗' },
      { id: 'beef', name: 'Beef', icon: '🥩' },
      { id: 'pork', name: 'Pork', icon: '🥓' },
      { id: 'fish', name: 'Fish', icon: '🐟' },
      { id: 'tofu', name: 'Tofu', icon: '🧊' },
      { id: 'eggs', name: 'Eggs', icon: '🥚' },
      { id: 'beans', name: 'Beans', icon: '🫘' }
    ],
    cookingMethods: [
      { id: 'grilled_protein', name: 'Grilled', icon: '🔥' },
      { id: 'baked_protein', name: 'Baked', icon: '🍳' },
      { id: 'fried_protein', name: 'Fried', icon: '🥘' },
      { id: 'boiled_protein', name: 'Boiled', icon: '♨️' },
      { id: 'smoked_protein', name: 'Smoked', icon: '💨' },
      { id: 'raw_protein', name: 'Raw', icon: '🍣' }
    ]
  },
  {
    name: 'Vegetables',
    items: [
      { id: 'tomato', name: 'Tomato', icon: '🍅' },
      { id: 'broccoli', name: 'Broccoli', icon: '🥦' },
      { id: 'carrot', name: 'Carrot', icon: '🥕' },
      { id: 'spinach', name: 'Spinach', icon: '🍃' },
      { id: 'mushroom', name: 'Mushroom', icon: '🍄' },
      { id: 'onion', name: 'Onion', icon: '🧅' },
      { id: 'pepper', name: 'Bell Pepper', icon: '🫑' }
    ],
    cookingMethods: [
      { id: 'raw_veg', name: 'Raw', icon: '🥗' },
      { id: 'steamed_veg', name: 'Steamed', icon: '♨️' },
      { id: 'roasted_veg', name: 'Roasted', icon: '🔥' },
      { id: 'sauteed_veg', name: 'Sautéed', icon: '🍳' },
      { id: 'grilled_veg', name: 'Grilled', icon: '🔥' },
      { id: 'boiled_veg', name: 'Boiled', icon: '🥣' }
    ]
  },
  {
    name: 'Fruits',
    items: [
      { id: 'apple', name: 'Apple', icon: '🍎' },
      { id: 'banana', name: 'Banana', icon: '🍌' },
      { id: 'orange', name: 'Orange', icon: '🍊' },
      { id: 'grapes', name: 'Grapes', icon: '🍇' },
      { id: 'strawberry', name: 'Strawberry', icon: '🍓' },
      { id: 'pineapple', name: 'Pineapple', icon: '🍍' },
      { id: 'watermelon', name: 'Watermelon', icon: '🍉' }
    ],
    cookingMethods: [
      { id: 'raw_fruit', name: 'Fresh', icon: '🥗' },
      { id: 'baked_fruit', name: 'Baked', icon: '🥧' },
      { id: 'dried_fruit', name: 'Dried', icon: '🍇' },
      { id: 'frozen_fruit', name: 'Frozen', icon: '❄️' },
      { id: 'juiced_fruit', name: 'Juiced', icon: '🧃' },
      { id: 'grilled_fruit', name: 'Grilled', icon: '🔥' }
    ]
  },
  {
    name: 'Grains & Carbs',
    items: [
      { id: 'rice', name: 'Rice', icon: '🍚' },
      { id: 'bread', name: 'Bread', icon: '🍞' },
      { id: 'pasta', name: 'Pasta', icon: '🍝' },
      { id: 'potato', name: 'Potato', icon: '🥔' },
      { id: 'corn', name: 'Corn', icon: '🌽' },
      { id: 'oats', name: 'Oats', icon: '🌾' },
      { id: 'quinoa', name: 'Quinoa', icon: '🥣' }
    ],
    cookingMethods: [
      { id: 'boiled_grain', name: 'Boiled', icon: '♨️' },
      { id: 'steamed_grain', name: 'Steamed', icon: '💨' },
      { id: 'baked_grain', name: 'Baked', icon: '🍞' },
      { id: 'fried_grain', name: 'Fried', icon: '🥘' },
      { id: 'roasted_grain', name: 'Roasted', icon: '🔥' },
      { id: 'raw_grain', name: 'Raw', icon: '🥣' }
    ]
  },
  {
    name: 'Dairy & Alternatives',
    items: [
      { id: 'milk', name: 'Milk', icon: '🥛' },
      { id: 'cheese', name: 'Cheese', icon: '🧀' },
      { id: 'yogurt', name: 'Yogurt', icon: '🥄' },
      { id: 'butter', name: 'Butter', icon: '🧈' },
      { id: 'icecream', name: 'Ice Cream', icon: '🍦' },
      { id: 'soy_milk', name: 'Soy Milk', icon: '🥛' },
      { id: 'almond_milk', name: 'Almond Milk', icon: '🌰' }
    ],
    cookingMethods: [
      { id: 'cold_dairy', name: 'Cold/Fresh', icon: '❄️' },
      { id: 'heated_dairy', name: 'Heated', icon: '♨️' },
      { id: 'fermented_dairy', name: 'Fermented', icon: '🧫' },
      { id: 'frozen_dairy', name: 'Frozen', icon: '🧊' },
      { id: 'whipped_dairy', name: 'Whipped', icon: '🍮' },
      { id: 'melted_dairy', name: 'Melted', icon: '🫕' }
    ]
  }
];

// Cuisine nationalities
const CUISINES = [
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'japanese', name: 'Japanese', icon: '🍣' },
  { id: 'chinese', name: 'Chinese', icon: '🥡' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'french', name: 'French', icon: '🥐' },
  { id: 'thai', name: 'Thai', icon: '🍜' },
  { id: 'greek', name: 'Greek', icon: '🥙' },
  { id: 'spanish', name: 'Spanish', icon: '🥘' },
  { id: 'korean', name: 'Korean', icon: '🍲' },
  { id: 'vietnamese', name: 'Vietnamese', icon: '🍲' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🫒' },
  { id: 'middle_eastern', name: 'Middle Eastern', icon: '🧆' },
  { id: 'caribbean', name: 'Caribbean', icon: '🍹' },
  { id: 'african', name: 'African', icon: '🍲' }
];

// Dietary restrictions options
const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
  'Lactose-Free',
  'Nut-Free',
  'Shellfish Allergy',
  'Keto',
  'Paleo',
  'Low FODMAP',
  'Kosher',
  'Halal'
];

// Spice level examples
const SPICE_EXAMPLES = [
  'None (Like plain steamed rice)',
  'Mild (Like black pepper)',
  'Medium (Like sriracha sauce)',
  'Hot (Like jalapeños)',
  'Extra Hot (Like habaneros)'
];

const FoodSurvey = () => {
  // Define all possible steps
  const TOTAL_STEPS = 8;

  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for survey data
  const [surveyData, setSurveyData] = useState({
    dietaryRestrictions: [],
    otherRestriction: '',
    spiceLevel: 0,
    cuisinePreferences: {},
    foodPreferences: {},
    cookingMethodPreferences: {},
    additionalPreferences: '',
    showingCookingMethods: false
  });
  
  // Update survey data
  const updateSurveyData = (field, value) => {
    setSurveyData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  // Handle dietary restriction selection
  const handleRestrictionToggle = (restriction) => {
    setSurveyData(prevData => {
      const restrictions = [...prevData.dietaryRestrictions];
      if (restrictions.includes(restriction)) {
        return {
          ...prevData,
          dietaryRestrictions: restrictions.filter(r => r !== restriction)
        };
      } else {
        return {
          ...prevData,
          dietaryRestrictions: [...restrictions, restriction]
        };
      }
    });
  };
  
  // Handle spice level selection
  const handleSpiceLevelChange = (level) => {
    updateSurveyData('spiceLevel', level);
  };
  
  // Handle food preference toggle
  const handlePreferenceToggle = (itemId, prefsKey) => {
    setSurveyData(prevData => {
      const preferences = { ...prevData[prefsKey] };
      const currentPref = preferences[itemId] || 'neutral';
      
      if (currentPref === 'neutral') {
        preferences[itemId] = 'loved';
      } else if (currentPref === 'loved') {
        preferences[itemId] = 'hated';
      } else {
        preferences[itemId] = 'neutral';
      }
      
      return {
        ...prevData,
        [prefsKey]: preferences
      };
    });
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle step navigation from progress dots
  const handleDotClick = (step) => {
    setCurrentStep(step);
  };
  
  // Submit data when survey is complete
  const handleSubmit = () => {
    // Here you would typically send this data to your backend
    console.log('Survey data submitted:', surveyData);
    
    // For demo purposes, just show an alert
    alert('Survey submitted successfully! Thank you for your preferences.');
    
    // Reset form or redirect - demo just resets to step 1
    setCurrentStep(1);
  };

  // Helper function to render food or cooking method items
  const renderPreferenceItems = (items, prefsKey) => {
    return (
      <div className="food-items">
        {items.map(item => (
          <div 
            key={item.id}
            className={`food-item ${surveyData[prefsKey][item.id] || 'neutral'}`}
            onClick={() => handlePreferenceToggle(item.id, prefsKey)}
          >
            <div className="food-icon">{item.icon}</div>
            <div className="food-name">{item.name}</div>
          </div>
        ))}
      </div>
    );
  };

  // Get current category based on step
  const getCurrentCategory = () => {
    if (currentStep >= 4 && currentStep <= 8) {
      return FOOD_CATEGORIES[currentStep - 4];
    }
    return null;
  };
  
  // Toggle between food items and cooking methods
  const toggleCookingMethodsView = (show) => {
    updateSurveyData('showingCookingMethods', show);
  };
  
  return (
    <div className="food-survey-container">
      <h1>Food Preferences Survey</h1>
      
      {/* Progress dots */}
      <div className="progress-dots">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <div 
            key={index + 1}
            className={`progress-dot ${currentStep === index + 1 ? 'active' : ''}`}
            onClick={() => handleDotClick(index + 1)}
          />
        ))}
      </div>
      
      {/* Survey content */}
      <div className="survey-content">
        {/* Step 1: Dietary Restrictions */}
        {currentStep === 1 && (
          <div className="survey-step">
            <h2>Dietary Restrictions</h2>
            <p>Please select any dietary restrictions or preferences that apply to you:</p>
            
            <div className="restriction-options">
              {DIETARY_RESTRICTIONS.map(restriction => (
                <div 
                  key={restriction}
                  className={`restriction-bubble ${surveyData.dietaryRestrictions.includes(restriction) ? 'active' : ''}`}
                  onClick={() => handleRestrictionToggle(restriction)}
                >
                  {restriction}
                </div>
              ))}
            </div>
            
            <div className="other-restriction">
              <label>
                <input 
                  type="checkbox" 
                  checked={surveyData.dietaryRestrictions.includes('Other')}
                  onChange={() => handleRestrictionToggle('Other')}
                />
                Other:
                <input 
                  type="text"
                  className="other-input"
                  value={surveyData.otherRestriction}
                  onChange={(e) => updateSurveyData('otherRestriction', e.target.value)}
                  placeholder="Please specify..."
                  disabled={!surveyData.dietaryRestrictions.includes('Other')}
                />
              </label>
            </div>
          </div>
        )}
        
        {/* Step 2: Spice Tolerance */}
        {currentStep === 2 && (
          <div className="survey-step">
            <h2>Spice Tolerance</h2>
            <p>How spicy do you like your food? Select your preference below:</p>
            
            <div className="spice-slider-container">
              <div className="spice-labels">
                <span>No Spice</span>
                <span>Mild</span>
                <span>Medium</span>
                <span>Hot</span>
                <span>Extra Hot</span>
              </div>
              
              <div className="spice-slider">
                {[0, 1, 2, 3, 4].map(level => (
                  <button 
                    key={level}
                    className={`spice-level ${surveyData.spiceLevel === level ? 'active' : ''}`}
                    onClick={() => handleSpiceLevelChange(level)}
                  >
                    {level === 0 ? '🍚' : level === 1 ? '🌶️' : level === 2 ? '🌶️🌶️' : level === 3 ? '🌶️🌶️🌶️' : '🔥'}
                  </button>
                ))}
                <div 
                  className="spice-indicator" 
                  style={{ left: `${surveyData.spiceLevel * 25 + 10}%` }}
                ></div>
              </div>
              
              <div className="spice-examples">
                {SPICE_EXAMPLES.map((example, index) => (
                  <span key={index}>{example}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Cuisine Preferences */}
        {currentStep === 3 && (
          <div className="survey-step">
            <h2>Cuisine Preferences</h2>
            <p>Click on cuisines once to mark as "Love", twice to mark as "Hate", and a third time to reset.</p>
            
            <div className="preference-legend">
              <div className="legend-item">
                <div className="legend-bubble"></div>
                <span>Neutral</span>
              </div>
              <div className="legend-item">
                <div className="legend-bubble loved"></div>
                <span>Love</span>
              </div>
              <div className="legend-item">
                <div className="legend-bubble hated"></div>
                <span>Dislike</span>
              </div>
            </div>
            
            <div className="food-items cuisine-items">
              {CUISINES.map(cuisine => (
                <div 
                  key={cuisine.id}
                  className={`food-item ${surveyData.cuisinePreferences[cuisine.id] || 'neutral'}`}
                  onClick={() => handlePreferenceToggle(cuisine.id, 'cuisinePreferences')}
                >
                  <div className="food-icon">{cuisine.icon}</div>
                  <div className="food-name">{cuisine.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Steps 4-8: Food Category Specific Questions */}
        {currentStep >= 4 && currentStep <= 8 && (
          <div className="survey-step">
            <h2>{FOOD_CATEGORIES[currentStep - 4].name} Preferences</h2>
            <p>Click on items once to mark as "Love", twice to mark as "Hate", and a third time to reset.</p>
            
            <div className="preference-legend">
              <div className="legend-item">
                <div className="legend-bubble"></div>
                <span>Neutral</span>
              </div>
              <div className="legend-item">
                <div className="legend-bubble loved"></div>
                <span>Love</span>
              </div>
              <div className="legend-item">
                <div className="legend-bubble hated"></div>
                <span>Dislike</span>
              </div>
            </div>
            
            <div className="section-tabs">
              <button 
                className={`section-tab ${!surveyData.showingCookingMethods ? 'active' : ''}`}
                onClick={() => toggleCookingMethodsView(false)}
              >
                Food Items
              </button>
              <button 
                className={`section-tab ${surveyData.showingCookingMethods ? 'active' : ''}`}
                onClick={() => toggleCookingMethodsView(true)}
              >
                Cooking Methods
              </button>
            </div>
            
            {!surveyData.showingCookingMethods ? (
              <div className="food-category">
                <h3>Food Items</h3>
                {renderPreferenceItems(FOOD_CATEGORIES[currentStep - 4].items, 'foodPreferences')}
              </div>
            ) : (
              <div className="food-category">
                <h3>Cooking Methods</h3>
                {renderPreferenceItems(FOOD_CATEGORIES[currentStep - 4].cookingMethods, 'cookingMethodPreferences')}
              </div>
            )}
          </div>
        )}
        
        {/* Additional Preferences */}
        {currentStep === TOTAL_STEPS && (
          <div className="survey-step">
            <h2>Additional Preferences</h2>
            <p>Please share any other food preferences or notes that would help us plan better meals for you:</p>
            
            <textarea
              value={surveyData.additionalPreferences}
              onChange={(e) => updateSurveyData('additionalPreferences', e.target.value)}
              placeholder="E.g., I prefer meals that can be prepared in under 30 minutes, I'm trying to reduce my sugar intake, etc."
            ></textarea>
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="survey-navigation">
        {currentStep > 1 && (
          <button className="back-button" onClick={goToPreviousStep}>
            Back
          </button>
        )}
        
        {currentStep < TOTAL_STEPS ? (
          <button className="next-button" onClick={goToNextStep}>
            Next
          </button>
        ) : (
          <button className="next-button" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodSurvey; 