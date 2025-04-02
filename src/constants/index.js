// Meal Types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
};

// Food Categories
export const FOOD_CATEGORIES = {
  PROTEIN: 'protein',
  CARBS: 'carbs',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  DAIRY: 'dairy',
  FATS: 'fats'
};

// Survey Questions
export const SURVEY_QUESTIONS = {
  DIETARY_PREFERENCES: 'dietaryPreferences',
  ALLERGIES: 'allergies',
  COOKING_SKILLS: 'cookingSkills',
  TIME_AVAILABILITY: 'timeAvailability'
};

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  MEAL_PLAN: '/api/meal-plan',
  FOOD_ITEMS: '/api/food-items',
  USER_PREFERENCES: '/api/user-preferences'
};

// UI Constants
export const UI_CONSTANTS = {
  MAX_MEAL_SLOTS: 21, // 3 meals * 7 days
  MAX_FOOD_ITEMS_PER_MEAL: 5,
  ANIMATION_DURATION: 300,
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
}; 