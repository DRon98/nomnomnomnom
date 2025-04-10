import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cooking_schedule: {
    frequency: 0,
    which_meals: {
      breakfast: 0,
      lunch: 0,
      snacks: 0
    },
    eating_out_frequency: 0,
    cooking_days: [],
    meal_prep_preferences: {
      max_servings_per_person: 3,
      max_days_to_eat: 3
    }
  },
  grocery_schedule: {
    frequency: 0,
    grocery_buying_method: 'In person',
    grocery_days: []
  },
  weekly_calendar: {},
  pantry_inventory: [],
  lastUpdated: null
};

const scheduleDataSlice = createSlice({
  name: 'scheduleData',
  initialState,
  reducers: {
    saveScheduleData: (state, action) => {
      return {
        ...action.payload,
        lastUpdated: new Date().toISOString()
      };
    },
    clearScheduleData: (state) => {
      return {
        ...initialState,
        lastUpdated: new Date().toISOString()
      };
    }
  }
});

// Selectors
export const selectScheduleData = (state) => state.scheduleData;
export const selectCookingSchedule = (state) => state.scheduleData.cooking_schedule;
export const selectGrocerySchedule = (state) => state.scheduleData.grocery_schedule;
export const selectWeeklyCalendar = (state) => state.scheduleData.weekly_calendar;
export const selectPantryInventory = (state) => state.scheduleData.pantry_inventory;
export const selectLastUpdated = (state) => state.scheduleData.lastUpdated;

export const { saveScheduleData, clearScheduleData } = scheduleDataSlice.actions;

export default scheduleDataSlice.reducer; 