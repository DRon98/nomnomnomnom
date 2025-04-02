import { createSlice } from '@reduxjs/toolkit';
import { MEAL_TYPES } from '../constants';

// Default meal times
const DEFAULT_MEAL_TIMES = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '19:00',
  snacks: '15:00'
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Normalized state structure
const initialState = {
  // Entities
  meals: {
    byId: {},
    allIds: []
  },
  
  // Day view meal plan (references to meal IDs)
  dayPlan: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  },
  
  // Week view meal plan (references to meal IDs)
  weekPlan: DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
    return acc;
  }, {}),
  
  // Settings
  mealTimes: DEFAULT_MEAL_TIMES,
  snackPeriods: [{ id: 'snacks', time: DEFAULT_MEAL_TIMES.snacks }]
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    // Add a meal entity
    addMeal: (state, action) => {
      const meal = action.payload;
      state.meals.byId[meal.id] = meal;
      if (!state.meals.allIds.includes(meal.id)) {
        state.meals.allIds.push(meal.id);
      }
    },
    
    // Add multiple meal entities
    addMeals: (state, action) => {
      const meals = action.payload;
      meals.forEach(meal => {
        state.meals.byId[meal.id] = meal;
        if (!state.meals.allIds.includes(meal.id)) {
          state.meals.allIds.push(meal.id);
        }
      });
    },
    
    // Add food to a meal slot (day or week view)
    addFoodToMeal: (state, action) => {
      const { mealType, food, day } = action.payload;
      
      // Create a meal entity if it doesn't exist
      const mealId = `${day || 'day'}_${mealType}_${Date.now()}`;
      const meal = {
        id: mealId,
        type: mealType,
        foodId: food.id,
        day: day || null,
        createdAt: Date.now()
      };
      
      // Add to entities
      state.meals.byId[mealId] = meal;
      state.meals.allIds.push(mealId);
      
      // Add reference to the appropriate plan
      if (day) {
        // Week plan
        state.weekPlan[day][mealType].push(mealId);
      } else {
        // Day plan
        state.dayPlan[mealType].push(mealId);
      }
    },
    
    // Remove food from a meal slot
    removeFoodFromMeal: (state, action) => {
      const { mealType, mealId, day } = action.payload;
      
      // Remove reference from the appropriate plan
      if (day) {
        // Week plan
        state.weekPlan[day][mealType] = state.weekPlan[day][mealType].filter(id => id !== mealId);
      } else {
        // Day plan
        state.dayPlan[mealType] = state.dayPlan[mealType].filter(id => id !== mealId);
      }
      
      // Remove the meal entity
      delete state.meals.byId[mealId];
      state.meals.allIds = state.meals.allIds.filter(id => id !== mealId);
    },
    
    // Clear a meal plan (day or week view)
    clearMealPlan: (state, action) => {
      const { day } = action.payload || {};
      
      if (day) {
        // Clear specific day in week plan
        Object.keys(state.weekPlan[day]).forEach(mealType => {
          // Remove meal entities
          state.weekPlan[day][mealType].forEach(mealId => {
            delete state.meals.byId[mealId];
          });
          
          // Clear references
          state.weekPlan[day][mealType] = [];
        });
      } else {
        // Clear day plan
        Object.keys(state.dayPlan).forEach(mealType => {
          // Remove meal entities
          state.dayPlan[mealType].forEach(mealId => {
            delete state.meals.byId[mealId];
          });
          
          // Clear references
          state.dayPlan[mealType] = [];
        });
      }
      
      // Clean up allIds
      state.meals.allIds = state.meals.allIds.filter(id => state.meals.byId[id]);
    },
    
    // Clear the entire week plan
    clearWeekPlan: (state) => {
      // Remove meal entities
      DAYS_OF_WEEK.forEach(day => {
        Object.keys(state.weekPlan[day]).forEach(mealType => {
          state.weekPlan[day][mealType].forEach(mealId => {
            delete state.meals.byId[mealId];
          });
        });
      });
      
      // Reset the entire week plan
      DAYS_OF_WEEK.forEach(day => {
        state.weekPlan[day] = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };
      });
      
      // Clean up allIds
      state.meals.allIds = state.meals.allIds.filter(id => state.meals.byId[id]);
    },
    
    // Generate a random meal plan
    generateRandomPlan: (state, action) => {
      const { breakfast, lunch, dinner, snacks, day } = action.payload;
      
      // Clear existing plan first
      if (day) {
        Object.keys(state.weekPlan[day]).forEach(mealType => {
          state.weekPlan[day][mealType].forEach(mealId => {
            delete state.meals.byId[mealId];
          });
          state.weekPlan[day][mealType] = [];
        });
      } else {
        Object.keys(state.dayPlan).forEach(mealType => {
          state.dayPlan[mealType].forEach(mealId => {
            delete state.meals.byId[mealId];
          });
          state.dayPlan[mealType] = [];
        });
      }
      
      // Add new meals
      const addFoodsToPlan = (foods, mealType, targetDay) => {
        foods.forEach(food => {
          const mealId = `${targetDay || 'day'}_${mealType}_${Date.now()}_${Math.random()}`;
          const meal = {
            id: mealId,
            type: mealType,
            foodId: food.id,
            day: targetDay || null,
            createdAt: Date.now()
          };
          
          // Add to entities
          state.meals.byId[mealId] = meal;
          state.meals.allIds.push(mealId);
          
          // Add reference to the appropriate plan
          if (targetDay) {
            state.weekPlan[targetDay][mealType].push(mealId);
          } else {
            state.dayPlan[mealType].push(mealId);
          }
        });
      };
      
      if (day) {
        addFoodsToPlan(breakfast, 'breakfast', day);
        addFoodsToPlan(lunch, 'lunch', day);
        addFoodsToPlan(dinner, 'dinner', day);
        addFoodsToPlan(snacks, 'snacks', day);
      } else {
        addFoodsToPlan(breakfast, 'breakfast');
        addFoodsToPlan(lunch, 'lunch');
        addFoodsToPlan(dinner, 'dinner');
        addFoodsToPlan(snacks, 'snacks');
      }
    },
    
    // Update meal time
    updateMealTime: (state, action) => {
      const { meal, time } = action.payload;
      state.mealTimes[meal] = time;
    }
  }
});

// Selectors
export const selectMealById = (state, id) => state.mealPlan.meals.byId[id];
export const selectDayPlanMeals = (state, mealType) => 
  state.mealPlan.dayPlan[mealType].map(id => state.mealPlan.meals.byId[id]).filter(Boolean);
export const selectWeekPlanMeals = (state, day, mealType) => 
  state.mealPlan.weekPlan[day][mealType].map(id => state.mealPlan.meals.byId[id]).filter(Boolean);
export const selectMealTimes = state => state.mealPlan.mealTimes;

export const { 
  addMeal,
  addMeals,
  addFoodToMeal, 
  removeFoodFromMeal, 
  clearMealPlan, 
  clearWeekPlan,
  generateRandomPlan, 
  updateMealTime 
} = mealPlanSlice.actions;

export default mealPlanSlice.reducer;