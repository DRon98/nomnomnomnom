import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentState: null,
  desiredState: null,
  dietaryRestrictions: {
    vegan: false,
    glutenFree: false
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setDesiredState: (state, action) => {
      state.desiredState = action.payload;
    },
    toggleDietaryRestriction: (state, action) => {
      const restriction = action.payload;
      state.dietaryRestrictions[restriction] = !state.dietaryRestrictions[restriction];
    }
  }
});

export const { setCurrentState, setDesiredState, toggleDietaryRestriction } = userSlice.actions;
export default userSlice.reducer; 