import { createSlice } from '@reduxjs/toolkit';

const MEAL_TYPES = ['Breakfast', 'Main(Lunch/Dinner)', 'Snack', 'Dessert'];

const initialState = MEAL_TYPES.reduce((acc, type) => {
  acc[type] = { count: 0, totalServings: 0, totalCalories: 0 };
  return acc;
}, {});

const mealTrackingSlice = createSlice({
  name: 'mealTracking',
  initialState,
  reducers: {
    addMeal: (state, action) => {
      const { mealType, servings, calories } = action.payload;
      // Ensure mealType exists, handling potential case differences or variations
      const normalizedMealType = MEAL_TYPES.find(mt => mt.toLowerCase() === mealType?.toLowerCase()) || 'Main(Lunch/Dinner)'; // Default if not found

      if (state[normalizedMealType]) {
        state[normalizedMealType].count += 1;
        state[normalizedMealType].totalServings += servings || 0;
        state[normalizedMealType].totalCalories += calories || 0;
      } else {
        // Initialize if somehow the type wasn't in initialState (shouldn't happen with current setup)
        state[normalizedMealType] = { count: 1, totalServings: servings || 0, totalCalories: calories || 0 };
      }
    },
    // Optional: Add reducers to remove meals or reset counts if needed later
  },
});

export const { addMeal } = mealTrackingSlice.actions;
export default mealTrackingSlice.reducer;