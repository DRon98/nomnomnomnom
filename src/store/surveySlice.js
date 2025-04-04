import { createSlice } from '@reduxjs/toolkit';
import { SURVEY_QUESTIONS } from '../constants';

const initialState = {
  // Survey data
  data: {
    [SURVEY_QUESTIONS.DIETARY_PREFERENCES]: [],
    [SURVEY_QUESTIONS.ALLERGIES]: [],
    [SURVEY_QUESTIONS.COOKING_SKILLS]: 'beginner',
    [SURVEY_QUESTIONS.TIME_AVAILABILITY]: 'medium'
  },
  
  // Food preferences
  foodPreferences: {
    proteins: [],
    vegetables: [],
    fruits: [],
    grains: [],
    dairy: [],
    fats: []
  },
  
  // Cooking method preferences
  cookingMethods: {
    proteins: [],
    vegetables: [],
    fruits: []
  },
  
  // Dietary restrictions
  dietaryRestrictions: {
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowCarb: false,
    lowFat: false,
    lowSodium: false
  },
  
  // Spice preferences
  spiceLevel: 'medium',
  
  // Survey progress
  currentStep: 0,
  isCompleted: false
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    // Update a specific survey field
    updateSurveyField: (state, action) => {
      const { field, value } = action.payload;
      state.data[field] = value;
    },
    
    // Update food preferences
    updateFoodPreferences: (state, action) => {
      const { category, items } = action.payload;
      state.foodPreferences[category] = items;
    },
    
    // Toggle a food preference
    toggleFoodPreference: (state, action) => {
      const { category, foodId } = action.payload;
      const index = state.foodPreferences[category].indexOf(foodId);
      
      if (index === -1) {
        state.foodPreferences[category].push(foodId);
      } else {
        state.foodPreferences[category].splice(index, 1);
      }
    },
    
    // Update cooking method preferences
    updateCookingMethods: (state, action) => {
      const { category, methods } = action.payload;
      state.cookingMethods[category] = methods;
    },
    
    // Toggle a cooking method preference
    toggleCookingMethod: (state, action) => {
      const { category, methodId } = action.payload;
      const index = state.cookingMethods[category].indexOf(methodId);
      
      if (index === -1) {
        state.cookingMethods[category].push(methodId);
      } else {
        state.cookingMethods[category].splice(index, 1);
      }
    },
    
    // Toggle a dietary restriction
    toggleDietaryRestriction: (state, action) => {
      const restrictionId = action.payload;
      state.dietaryRestrictions[restrictionId] = !state.dietaryRestrictions[restrictionId];
    },
    
    // Set spice level
    setSpiceLevel: (state, action) => {
      state.spiceLevel = action.payload;
    },
    
    // Update survey progress
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    
    // Mark survey as completed
    completeSurvey: (state) => {
      state.isCompleted = true;
      console.log('Food Preferences Survey Responses:', {
        dietaryPreferences: state.dietaryRestrictions,
        allergies: state.data[SURVEY_QUESTIONS.ALLERGIES],
        cookingSkills: state.data[SURVEY_QUESTIONS.COOKING_SKILLS],
        timeAvailability: state.data[SURVEY_QUESTIONS.TIME_AVAILABILITY],
        foodPreferences: {
          proteins: { love: state.foodPreferences.proteins, neutral: [], hate: [] },
          vegetables: { love: state.foodPreferences.vegetables, neutral: [], hate: [] },
          fruits: { love: state.foodPreferences.fruits, neutral: [], hate: [] },
          grains: { love: state.foodPreferences.grains, neutral: [], hate: [] },
          dairy: { love: state.foodPreferences.dairy, neutral: [], hate: [] },
          fats: { love: state.foodPreferences.fats, neutral: [], hate: [] }
        },
        cookingMethods: state.cookingMethods,
        spiceLevel: state.spiceLevel
      });
    },
    
    // Reset survey
    resetSurvey: () => initialState
  }
});

// Selectors
export const selectSurveyData = state => state.survey.data;
export const selectFoodPreferences = state => state.survey.foodPreferences;
export const selectCookingMethods = state => state.survey.cookingMethods;
export const selectDietaryRestrictions = state => state.survey.dietaryRestrictions;
export const selectSpiceLevel = state => state.survey.spiceLevel;
export const selectSurveyProgress = state => ({
  currentStep: state.survey.currentStep,
  isCompleted: state.survey.isCompleted
});

export const {
  updateSurveyField,
  updateFoodPreferences,
  toggleFoodPreference,
  updateCookingMethods,
  toggleCookingMethod,
  toggleDietaryRestriction,
  setSpiceLevel,
  setCurrentStep,
  completeSurvey,
  resetSurvey
} = surveySlice.actions;

export default surveySlice.reducer; 