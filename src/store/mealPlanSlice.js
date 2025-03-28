import { createSlice } from '@reduxjs/toolkit';

// Default meal times
const DEFAULT_MEAL_TIMES = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '19:00',
  snacks: '15:00'
};

const initialState = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
  mealTimes: DEFAULT_MEAL_TIMES,
  snackPeriods: [{ id: 'snacks', time: DEFAULT_MEAL_TIMES.snacks }]
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    addFoodToMeal: (state, action) => {
      const { meal, food } = action.payload;
      state[meal].push({
        ...food
      });
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
    },
    updateMealTime: (state, action) => {
      const { meal, time } = action.payload;
      state.mealTimes[meal] = time;
    }
  }
});

export const { addFoodToMeal, removeFoodFromMeal, clearMealPlan, generateRandomPlan, updateMealTime } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;