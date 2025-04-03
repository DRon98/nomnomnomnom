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
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  GRAINS: 'grains',
  DAIRY: 'dairy',
  FATS: 'fats'
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  PANTRY: 'pantry',
  SHOPPING_LIST: 'shopping_list',
  NEED_TO_PURCHASE: 'need_to_purchase',
  // Food Categories
  ...Object.entries(FOOD_CATEGORIES).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value
  }), {})
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