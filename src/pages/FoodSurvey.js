import React, { useState } from 'react';
import './FoodSurvey.css';
import { useDispatch, useSelector } from 'react-redux';
// import {
//   toggleDietaryRestriction,
//   setOtherRestriction,
//   setSpiceLevel,
//   togglePreference,
//   setAdditionalPreferences,
//   toggleCookingMethodsView
// } from '../store/foodPreferencesSlice';
import {
  toggleDietaryRestriction,
  setOtherRestriction,
  setSpiceLevel,
  togglePreference,
  setAdditionalPreferences,
  toggleCookingMethodsView
} from '../store/foodPreferencesSlice';
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
  const TOTAL_STEPS = 9;
  const dispatch = useDispatch();
  
  // Fix the selector to use the correct state path
  const responses = useSelector(state => state.foodPreferences.responses);
  
  // Keep currentStep as local state since it's UI-specific
  const [currentStep, setCurrentStep] = useState(1);
  
  // Add new state for meal prep preferences
  const [maxServings, setMaxServings] = useState(1);
  const [maxDaysAfterCooking, setMaxDaysAfterCooking] = useState(1);
  
  // Update handlers to use Redux actions
  const handleRestrictionToggle = (restriction) => {
    dispatch(toggleDietaryRestriction(restriction));
  };
  
  const handleOtherRestrictionChange = (value) => {
    dispatch(setOtherRestriction(value));
  };
  
  const handleSpiceLevelChange = (level) => {
    dispatch(setSpiceLevel(level));
  };
  
  const handlePreferenceToggle = (itemId, prefsKey) => {
    dispatch(togglePreference({ itemId, prefsKey }));
  };
  
  const handleAdditionalPreferencesChange = (value) => {
    dispatch(setAdditionalPreferences(value));
  };
  
  const handleCookingMethodsViewToggle = (show) => {
    dispatch(toggleCookingMethodsView(show));
  };
  
  // Navigation functions remain the same
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
  
  const handleDotClick = (step) => {
    setCurrentStep(step);
  };
  
  const handleSubmit = () => {
    console.log('Survey data submitted:', responses);
    alert('Survey submitted successfully! Thank you for your preferences.');
    setCurrentStep(1);
  };

  // Helper function to render food or cooking method items
  const renderPreferenceItems = (items, prefsKey) => {
    return (
      <div className="food-items">
        {items.map(item => (
          <div 
            key={item.id}
            className={`food-item ${responses[prefsKey][item.id] || 'neutral'}`}
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
    if (currentStep >= 5 && currentStep <= 9) {
      return FOOD_CATEGORIES[currentStep - 5];
    }
    return null;
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
                  className={`restriction-bubble ${responses.dietaryRestrictions.includes(restriction) ? 'active' : ''}`}
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
                  checked={responses.dietaryRestrictions.includes('Other')}
                  onChange={() => handleRestrictionToggle('Other')}
                />
                Other:
                <input 
                  type="text"
                  className="other-input"
                  value={responses.otherRestriction}
                  onChange={(e) => handleOtherRestrictionChange(e.target.value)}
                  placeholder="Please specify..."
                  disabled={!responses.dietaryRestrictions.includes('Other')}
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
                    className={`spice-level ${responses.spiceLevel === level ? 'active' : ''}`}
                    onClick={() => handleSpiceLevelChange(level)}
                  >
                    {level === 0 ? '🍚' : level === 1 ? '🌶️' : level === 2 ? '🌶️🌶️' : level === 3 ? '🌶️🌶️🌶️' : '🔥'}
                  </button>
                ))}
                <div 
                  className="spice-indicator" 
                  style={{ left: `${responses.spiceLevel * 25 + 10}%` }}
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
                  className={`food-item ${responses.cuisinePreferences[cuisine.id] || 'neutral'}`}
                  onClick={() => handlePreferenceToggle(cuisine.id, 'cuisinePreferences')}
                >
                  <div className="food-icon">{cuisine.icon}</div>
                  <div className="food-name">{cuisine.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="survey-step">
            <h2>Meal Prep Preferences</h2>
            
            <div className="meal-prep-section">
              <div className="prep-question">
                <h3>What is the maximum amount of servings per person that you would cook for a meal?</h3>
                <div className="number-input-container">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxServings}
                    onChange={(e) => setMaxServings(parseInt(e.target.value) || 1)}
                    className="frequency-input"
                  />
                  <span>servings</span>
                </div>
              </div>

              <div className="prep-question">
                <h3>Maximum amount of days after cooking that you would eat that meal:</h3>
                <div className="number-input-container">
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={maxDaysAfterCooking}
                    onChange={(e) => setMaxDaysAfterCooking(parseInt(e.target.value) || 1)}
                    className="frequency-input"
                  />
                  <span>days</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Steps 5-9: Food Category Specific Questions */}
        {currentStep >= 5 && currentStep <= 9 && (
          <div className="survey-step">
            <h2>{FOOD_CATEGORIES[currentStep - 5].name} Preferences</h2>
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
                className={`section-tab ${!responses.showingCookingMethods ? 'active' : ''}`}
                onClick={() => handleCookingMethodsViewToggle(false)}
              >
                Food Items
              </button>
              <button 
                className={`section-tab ${responses.showingCookingMethods ? 'active' : ''}`}
                onClick={() => handleCookingMethodsViewToggle(true)}
              >
                Cooking Methods
              </button>
            </div>
            
            {!responses.showingCookingMethods ? (
              <div className="food-category">
                <h3>Food Items</h3>
                {renderPreferenceItems(FOOD_CATEGORIES[currentStep - 5].items, 'foodPreferences')}
              </div>
            ) : (
              <div className="food-category">
                <h3>Cooking Methods</h3>
                {renderPreferenceItems(FOOD_CATEGORIES[currentStep - 5].cookingMethods, 'cookingMethodPreferences')}
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
              value={responses.additionalPreferences}
              onChange={(e) => handleAdditionalPreferencesChange(e.target.value)}
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

