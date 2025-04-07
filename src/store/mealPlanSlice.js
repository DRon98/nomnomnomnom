import { createSlice } from '@reduxjs/toolkit';
import { MEAL_TYPES } from '../constants';

// Default meal times
const DEFAULT_MEAL_TIMES = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '19:00',
  snacks: '15:00'
};

// Helper function to get next 7 days' ISO date strings
const getNext7DaysKeys = () => {
  const days = {};
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const key = date.toISOString().split('T')[0];
    days[key] = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
  }
  
  return days;
};

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
  weekPlan: getNext7DaysKeys(),
  
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
        food: { ...food },  // Store the complete food data
        day: day || null,
        createdAt: Date.now()
      };
      
      // Add to entities
      state.meals.byId[mealId] = meal;
      state.meals.allIds.push(mealId);
      
      // Add reference to the appropriate plan
      if (day) {
        // Week plan - ensure the day exists
        if (!state.weekPlan[day]) {
          state.weekPlan[day] = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          };
        }
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
        if (state.weekPlan[day]) {
          state.weekPlan[day][mealType] = state.weekPlan[day][mealType].filter(id => id !== mealId);
        }
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
        if (state.weekPlan[day]) {
          Object.keys(state.weekPlan[day]).forEach(mealType => {
            // Remove meal entities
            state.weekPlan[day][mealType].forEach(mealId => {
              delete state.meals.byId[mealId];
            });
            
            // Clear references
            state.weekPlan[day][mealType] = [];
          });
        }
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
    
    // Generate random plan
    generateRandomPlan: (state, action) => {
      const { breakfast, lunch, dinner, snacks, day } = action.payload;
      
      // Clear existing meals first
      if (day) {
        if (!state.weekPlan[day]) {
          state.weekPlan[day] = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          };
        }
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
            food: { ...food },
            day: targetDay || null,
            createdAt: Date.now()
          };
          
          // Add to entities
          state.meals.byId[mealId] = meal;
          state.meals.allIds.push(mealId);
          
          // Add reference to the appropriate plan
          if (targetDay) {
            if (!state.weekPlan[targetDay]) {
              state.weekPlan[targetDay] = {
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: []
              };
            }
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
  state.mealPlan.dayPlan[mealType]
    .map(id => {
      const meal = state.mealPlan.meals.byId[id];
      return meal ? {
        ...meal.food,
        mealId: meal.id
      } : null;
    })
    .filter(Boolean);

export const selectWeekPlanMeals = (state, day, mealType) => {
  if (!state.mealPlan.weekPlan[day]) {
    return [];
  }
  return state.mealPlan.weekPlan[day][mealType]
    .map(id => {
      const meal = state.mealPlan.meals.byId[id];
      return meal ? {
        ...meal.food,
        mealId: meal.id
      } : null;
    })
    .filter(Boolean);
};

export const {
  addMeal,
  addMeals,
  addFoodToMeal,
  removeFoodFromMeal,
  clearMealPlan,
  generateRandomPlan,
  updateMealTime
} = mealPlanSlice.actions;

export default mealPlanSlice.reducer;