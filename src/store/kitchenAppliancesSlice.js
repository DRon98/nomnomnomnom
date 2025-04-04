import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAppliances: {
    basics: [],
    cooking: [],
    prep: [],
    specialty: []
  }
};

const kitchenAppliancesSlice = createSlice({
  name: 'kitchenAppliances',
  initialState,
  reducers: {
    toggleAppliance: (state, action) => {
      const { appliance, category } = action.payload;
      const categoryAppliances = state.selectedAppliances[category];
      const index = categoryAppliances.indexOf(appliance);
      
      if (index === -1) {
        categoryAppliances.push(appliance);
      } else {
        categoryAppliances.splice(index, 1);
      }
    },
    
    toggleCategory: (state, action) => {
      const { category, items } = action.payload;
      const currentAppliances = state.selectedAppliances[category];
      
      if (items.every(item => currentAppliances.includes(item))) {
        // If all items are selected, remove them all
        state.selectedAppliances[category] = [];
      } else {
        // Otherwise, add all missing items
        state.selectedAppliances[category] = items;
      }
    },
    
    setSelectedAppliances: (state, action) => {
      state.selectedAppliances = action.payload;
    },
    
    clearSelectedAppliances: (state) => {
      state.selectedAppliances = {
        basics: [],
        cooking: [],
        prep: [],
        specialty: []
      };
    }
  }
});

export const {
  toggleAppliance,
  toggleCategory,
  setSelectedAppliances,
  clearSelectedAppliances
} = kitchenAppliancesSlice.actions;

export default kitchenAppliancesSlice.reducer; 