import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: []
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    addFoodToMeal: (state, action) => {
      const { meal, food } = action.payload;
      state[meal].push(food);
    },
    removeFoodFromMeal: (state, action) => {
      const { meal, foodId } = action.payload;
      state[meal] = state[meal].filter(food => food.id !== foodId);
    },
    clearMealPlan: (state) => {
      state.breakfast = [];
      state.lunch = [];
      state.dinner = [];
      state.snacks = [];
    },
    generateRandomPlan: (state, action) => {
      const { breakfast, lunch, dinner, snacks } = action.payload;
      state.breakfast = breakfast;
      state.lunch = lunch;
      state.dinner = dinner;
      state.snacks = snacks;
    }
  }
});

export const { addFoodToMeal, removeFoodFromMeal, clearMealPlan, generateRandomPlan } = mealPlanSlice.actions;
export default mealPlanSlice.reducer; 