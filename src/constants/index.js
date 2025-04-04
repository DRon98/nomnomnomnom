/**
 * @constant {Object} MEAL_TYPES - Categories of meal types
 */
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
};

/**
 * @constant {Object} FOOD_CATEGORIES - Categories of food items
 */
export const FOOD_CATEGORIES = {
  PROTEIN: 'protein',
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  GRAINS: 'grains',
  DAIRY: 'dairy',
  FATS: 'fats'
};

/**
 * @constant {Object} FILTER_OPTIONS - Filter options for food items
 */
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

/**
 * @constant {Object} SURVEY_QUESTIONS - Survey questions for user preferences
 */
export const SURVEY_QUESTIONS = {
  DIETARY_PREFERENCES: 'dietaryPreferences',
  ALLERGIES: 'allergies',
  COOKING_SKILLS: 'cookingSkills',
  TIME_AVAILABILITY: 'timeAvailability'
};

/**
 * @constant {Object} API_ENDPOINTS - API endpoints for future use
 */
export const API_ENDPOINTS = {
  MEAL_PLAN: '/api/meal-plan',
  FOOD_ITEMS: '/api/food-items',
  USER_PREFERENCES: '/api/user-preferences'
};

/**
 * @constant {Object} UI_CONSTANTS - UI constants for the application
 */
export const UI_CONSTANTS = {
  MAX_MEAL_SLOTS: 21, // 3 meals * 7 days
  MAX_FOOD_ITEMS_PER_MEAL: 5,
  ANIMATION_DURATION: 300,
};

/**
 * @constant {Object} ERROR_MESSAGES - Error messages for user feedback
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
};

/**
 * @constant {Object} MOCK_FOODS - Mock food data for development
 * @property {number} id - Unique identifier for the food
 * @property {string} name - Display name of the food
 * @property {string} icon - Emoji icon representing the food
 * @property {string} type - Category of the food (protein, grain, etc.)
 */
export const MOCK_FOODS = [
  { id: 1, name: 'Chicken Breast', icon: '🍗', type: 'protein' },
  { id: 2, name: 'Salmon', icon: '🐟', type: 'protein' },
  { id: 3, name: 'Quinoa', icon: '🌾', type: 'grain' },
  { id: 4, name: 'Brown Rice', icon: '🍚', type: 'grain' },
  { id: 5, name: 'Broccoli', icon: '🥦', type: 'vegetable' },
  { id: 6, name: 'Spinach', icon: '🥬', type: 'vegetable' },
  { id: 7, name: 'Apple', icon: '🍎', type: 'fruit' },
  { id: 8, name: 'Banana', icon: '🍌', type: 'fruit' },
  { id: 9, name: 'Yogurt', icon: '🥛', type: 'dairy' },
  { id: 10, name: 'Eggs', icon: '🥚', type: 'protein' },
];

/**
 * @constant {Object} FOOD_TYPES - Categories of food items
 */
export const FOOD_TYPES = {
  PROTEIN: 'protein',
  GRAIN: 'grain',
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
  DAIRY: 'dairy'
};

/**
 * @constant {Object} FOOD_CONSUMPTION_LEVELS - Possible levels of recommended food consumption
 */
export const FOOD_CONSUMPTION_LEVELS = {
  ALL: 'all',
  MOST: 'most',
  SOME: 'some',
  NONE: 'none'
};

/**
 * @constant {Object} QUICK_JOURNAL_MESSAGES - Response messages for quick journal completion
 */
export const QUICK_JOURNAL_MESSAGES = {
  all: 'Great job! Add details',
  most: 'Nice work! Log more',
  some: 'Good start! Complete journal',
  none: 'No worries! Log details'
}; 