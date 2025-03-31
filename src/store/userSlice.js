import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStates: [],
  desiredStates: [],
  dietaryRestrictions: {
    vegan: false,
    glutenFree: false
  },
  activeView: 'day', // 'day' or 'week'
  weekFeelings: [], // Array to store feelings assigned to days of the week
  hasSeenWeekViewTooltip: false // Track if user has seen the week view tooltip
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCurrentState: (state, action) => {
      if (!state.currentStates.includes(action.payload)) {
        state.currentStates.push(action.payload);
      }
    },
    removeCurrentState: (state, action) => {
      state.currentStates = state.currentStates.filter(s => s !== action.payload);
    },
    addDesiredState: (state, action) => {
      if (!state.desiredStates.includes(action.payload)) {
        state.desiredStates.push(action.payload);
      }
    },
    removeDesiredState: (state, action) => {
      state.desiredStates = state.desiredStates.filter(s => s !== action.payload);
    },
    toggleDietaryRestriction: (state, action) => {
      const restriction = action.payload;
      state.dietaryRestrictions[restriction] = !state.dietaryRestrictions[restriction];
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    addWeekFeeling: (state, action) => {
      const { feeling, days } = action.payload;
      state.weekFeelings.push({ feeling, days });
    },
    removeWeekFeeling: (state, action) => {
      state.weekFeelings = state.weekFeelings.filter(f => f.feeling !== action.payload);
    },
    updateWeekFeelingDays: (state, action) => {
      const { feeling, days } = action.payload;
      const feelingIndex = state.weekFeelings.findIndex(f => f.feeling === feeling);
      if (feelingIndex !== -1) {
        state.weekFeelings[feelingIndex].days = days;
      }
    },
    setHasSeenWeekViewTooltip: (state) => {
      state.hasSeenWeekViewTooltip = true;
    }
  }
});

export const {
  addCurrentState,
  removeCurrentState,
  addDesiredState,
  removeDesiredState,
  toggleDietaryRestriction,
  setActiveView,
  addWeekFeeling,
  removeWeekFeeling,
  updateWeekFeelingDays,
  setHasSeenWeekViewTooltip
} = userSlice.actions;
export default userSlice.reducer;