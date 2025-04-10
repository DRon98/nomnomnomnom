import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weeklySchedule: null,
  lastUpdated: null
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    saveWeeklySchedule: (state, action) => {
      state.weeklySchedule = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearWeeklySchedule: (state) => {
      state.weeklySchedule = null;
      state.lastUpdated = null;
    }
  }
});

export const { saveWeeklySchedule, clearWeeklySchedule } = calendarSlice.actions;

// Selectors
export const selectWeeklySchedule = (state) => state.calendar.weeklySchedule;
export const selectLastUpdated = (state) => state.calendar.lastUpdated;

export default calendarSlice.reducer; 