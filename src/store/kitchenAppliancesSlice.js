import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAppliances: {
    basics: [],
    cooking: [],
    prep: [],
    specialty: []
  },
  appliancesToDelete: []
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
    
    addApplianceToDelete: (state, action) => {
      if (!state.appliancesToDelete.includes(action.payload)) {
        state.appliancesToDelete.push(action.payload);
      }
    },
    
    clearAppliancesToDelete: (state) => {
      state.appliancesToDelete = [];
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
  },
  markForDeletion: (state, action) => {
    const applianceId = action.payload;
    if (!state.appliancesToDelete.includes(applianceId)) {
      state.appliancesToDelete.push(applianceId);
    }
  },
  unmarkForDeletion: (state, action) => {
    const applianceId = action.payload;
    state.appliancesToDelete = state.appliancesToDelete.filter(id => id !== applianceId);
  },
});

export const {
  toggleAppliance,
  toggleCategory,
  addApplianceToDelete,
  clearAppliancesToDelete,
  setSelectedAppliances,
  clearSelectedAppliances
} = kitchenAppliancesSlice.actions;

export default kitchenAppliancesSlice.reducer; 