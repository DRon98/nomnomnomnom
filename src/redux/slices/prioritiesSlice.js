import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPriorities: []
};

const prioritiesSlice = createSlice({
  name: 'priorities',
  initialState,
  reducers: {
    setPriorities: (state, action) => {
      state.selectedPriorities = action.payload;
    },
    addPriority: (state, action) => {
      if (!state.selectedPriorities.includes(action.payload)) {
        state.selectedPriorities.push(action.payload);
      }
    },
    removePriority: (state, action) => {
      state.selectedPriorities = state.selectedPriorities.filter(
        priority => priority !== action.payload
      );
    },
    clearPriorities: (state) => {
      state.selectedPriorities = [];
    }
  }
});

export const { 
  setPriorities, 
  addPriority, 
  removePriority, 
  clearPriorities 
} = prioritiesSlice.actions;

export const selectPriorities = (state) => state.priorities.selectedPriorities;

export default prioritiesSlice.reducer; 