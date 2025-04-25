import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAppliances: {
    basics: [],
    cooking: [],
    prep: [],
    specialty: []
  },
  applianceToggles: [] // Array of { appliance_id, is_owned }
};

const kitchenAppliancesSlice = createSlice({
  name: 'kitchenAppliances',
  initialState,
  reducers: {
    toggleAppliance: (state, action) => {
      const { appliance, category, applianceId } = action.payload;
      const categoryAppliances = state.selectedAppliances[category];
      const index = categoryAppliances.indexOf(appliance);
      
      if (index === -1) {
        categoryAppliances.push(appliance);
        // Add to toggles if it's a new appliance
        if (applianceId) {
          state.applianceToggles.push({ appliance_id: applianceId, is_owned: true });
        }
      } else {
        categoryAppliances.splice(index, 1);
        // Add to toggles if it's an existing appliance
        if (applianceId) {
          state.applianceToggles.push({ appliance_id: applianceId, is_owned: false });
        }
      }
    },
    
    toggleCategory: (state, action) => {
      const { category, items, applianceIds } = action.payload;
      const currentAppliances = state.selectedAppliances[category];
      
      if (items.every(item => currentAppliances.includes(item))) {
        // If all items are selected, remove them all
        state.selectedAppliances[category] = [];
        // Add all appliance IDs to toggles with is_owned: false
        applianceIds?.forEach(id => {
          state.applianceToggles.push({ appliance_id: id, is_owned: false });
        });
      } else {
        // Otherwise, add all missing items
        state.selectedAppliances[category] = items;
        // Add all appliance IDs to toggles with is_owned: true
        applianceIds?.forEach(id => {
          state.applianceToggles.push({ appliance_id: id, is_owned: true });
        });
      }
    },
    
    clearApplianceToggles: (state) => {
      state.applianceToggles = [];
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
  clearApplianceToggles,
  setSelectedAppliances,
  clearSelectedAppliances
} = kitchenAppliancesSlice.actions;

export default kitchenAppliancesSlice.reducer; 