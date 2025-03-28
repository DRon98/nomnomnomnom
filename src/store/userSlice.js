import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStates: [],
  desiredStates: [],
  dietaryRestrictions: {
    vegan: false,
    glutenFree: false
  }
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
    }
  }
});

export const {
  addCurrentState,
  removeCurrentState,
  addDesiredState,
  removeDesiredState,
  toggleDietaryRestriction
} = userSlice.actions;
export default userSlice.reducer; 