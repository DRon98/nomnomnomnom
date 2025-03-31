import { createSlice } from '@reduxjs/toolkit';

// Default meal times
const DEFAULT_MEAL_TIMES = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '19:00',
  snacks: '15:00'
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialState = {
  // Day view meal plan
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
  mealTimes: DEFAULT_MEAL_TIMES,
  snackPeriods: [{ id: 'snacks', time: DEFAULT_MEAL_TIMES.snacks }],
  
  // Week view meal plan
  weekPlan: DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
    return acc;
  }, {})
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    addFoodToMeal: (state, action) => {
      const { meal, food, day } = action.payload;
      
      // If day is provided, add to week plan
      if (day) {
        if (!state.weekPlan[day][meal]) {
          state.weekPlan[day][meal] = [];
        }
        state.weekPlan[day][meal].push({
          ...food
        });
      } else {
        // Add to day plan
        state[meal].push({
          ...food
        });
      }
    },
    removeFoodFromMeal: (state, action) => {
      const { meal, foodId, day } = action.payload;
      
      if (day) {
        // Remove from week plan
        state.weekPlan[day][meal] = state.weekPlan[day][meal].filter(food => food.id !== foodId);
      } else {
        // Remove from day plan
        state[meal] = state[meal].filter(food => food.id !== foodId);
      }
    },
    clearMealPlan: (state, action) => {
      const { day } = action.payload || {};
      
      if (day) {
        // Clear specific day in week plan
        state.weekPlan[day] = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };
      } else {
        // Clear day plan
        state.breakfast = [];
        state.lunch = [];
        state.dinner = [];
        state.snacks = [];
      }
    },
    clearWeekPlan: (state) => {
      // Reset the entire week plan
      DAYS_OF_WEEK.forEach(day => {
        state.weekPlan[day] = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };
      });
    },
    generateRandomPlan: (state, action) => {
      const { breakfast, lunch, dinner, snacks, day } = action.payload;
      
      if (day) {
        // Generate for specific day in week plan
        state.weekPlan[day].breakfast = breakfast;
        state.weekPlan[day].lunch = lunch;
        state.weekPlan[day].dinner = dinner;
        state.weekPlan[day].snacks = snacks;
      } else {
        // Generate for day plan
        state.breakfast = breakfast;
        state.lunch = lunch;
        state.dinner = dinner;
        state.snacks = snacks;
      }
    },
    updateMealTime: (state, action) => {
      const { meal, time, day } = action.payload;
      
      // For now, we'll keep meal times consistent across all days
      state.mealTimes[meal] = time;
    }
  }
});

export const { 
  addFoodToMeal, 
  removeFoodFromMeal, 
  clearMealPlan, 
  clearWeekPlan,
  generateRandomPlan, 
  updateMealTime 
} = mealPlanSlice.actions;
export default mealPlanSlice.reducer;