import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setCurrentStep, 
  completeSurvey,
  updateSurveyField
} from '../../store/surveySlice';
import SurveyStep from './SurveyStep';
import FoodPreferenceSelector from './FoodPreferenceSelector';
import CookingMethodSelector from './CookingMethodSelector';
import DietaryRestrictionsSelector from './DietaryRestrictionsSelector';
import SpiceLevelSelector from './SpiceLevelSelector';
import ErrorBoundary from '../common/ErrorBoundary';

// Food categories data
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
      { id: 'strawberry', name: 'Strawberry', icon: '🍓' },
      { id: 'blueberry', name: 'Blueberry', icon: '🫐' },
      { id: 'grape', name: 'Grape', icon: '🍇' },
      { id: 'watermelon', name: 'Watermelon', icon: '🍉' }
    ],
    cookingMethods: [
      { id: 'raw_fruit', name: 'Raw', icon: '🍎' },
      { id: 'baked_fruit', name: 'Baked', icon: '🍎' },
      { id: 'blended_fruit', name: 'Blended', icon: '🥤' },
      { id: 'frozen_fruit', name: 'Frozen', icon: '🧊' }
    ]
  }
];

const FoodSurvey = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentStep = useSelector(state => state.survey.currentStep);
  const [currentCategory, setCurrentCategory] = useState(0);
  
  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep < 4) {
      dispatch(setCurrentStep(currentStep + 1));
    } else {
      dispatch(completeSurvey());
      navigate('/meal-planner');
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };
  
  // Handle category navigation
  const goToNextCategory = () => {
    if (currentCategory < FOOD_CATEGORIES.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      goToNextStep();
    }
  };
  
  const goToPreviousCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    } else {
      goToPreviousStep();
    }
  };
  
  // Handle survey completion
  const handleComplete = () => {
    dispatch(completeSurvey());
    navigate('/meal-planner');
  };
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Welcome to the Food Survey</h2>
            <p className="mb-4">
              This survey will help us understand your food preferences and dietary needs
              to create personalized meal plans for you.
            </p>
            <p className="mb-4">
              The survey consists of 5 steps and should take about 5 minutes to complete.
            </p>
            <p>
              Let's get started!
            </p>
          </div>
        );
        
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Food Preferences</h2>
            <p className="mb-6">
              Select the foods you like from each category. You can select multiple items.
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {FOOD_CATEGORIES[currentCategory].name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousCategory}
                    disabled={currentCategory === 0}
                    className={`px-3 py-1 rounded-md ${
                      currentCategory === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextCategory}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {currentCategory === FOOD_CATEGORIES.length - 1 ? 'Next Step' : 'Next Category'}
                  </button>
                </div>
              </div>
              
              <FoodPreferenceSelector
                category={FOOD_CATEGORIES[currentCategory].name.toLowerCase()}
                items={FOOD_CATEGORIES[currentCategory].items}
              />
            </div>
            
            <div className="flex justify-center space-x-2 mt-4">
              {FOOD_CATEGORIES.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentCategory ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cooking Methods</h2>
            <p className="mb-6">
              Select your preferred cooking methods for each food category.
            </p>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {FOOD_CATEGORIES[currentCategory].name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousCategory}
                    disabled={currentCategory === 0}
                    className={`px-3 py-1 rounded-md ${
                      currentCategory === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextCategory}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {currentCategory === FOOD_CATEGORIES.length - 1 ? 'Next Step' : 'Next Category'}
                  </button>
                </div>
              </div>
              
              <CookingMethodSelector
                category={FOOD_CATEGORIES[currentCategory].name.toLowerCase()}
                methods={FOOD_CATEGORIES[currentCategory].cookingMethods}
              />
            </div>
            
            <div className="flex justify-center space-x-2 mt-4">
              {FOOD_CATEGORIES.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentCategory ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <DietaryRestrictionsSelector />
        );
        
      case 4:
        return (
          <SpiceLevelSelector />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Food Preference Survey</h1>
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-2 rounded-full ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <SurveyStep
          step={currentStep}
          title={
            currentStep === 0 ? 'Welcome' :
            currentStep === 1 ? 'Food Preferences' :
            currentStep === 2 ? 'Cooking Methods' :
            currentStep === 3 ? 'Dietary Restrictions' :
            'Spice Level'
          }
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          isLastStep={currentStep === 4}
        >
          {renderStepContent()}
        </SurveyStep>
      </div>
    </ErrorBoundary>
  );
};

export default FoodSurvey; 