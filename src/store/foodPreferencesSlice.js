import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    responses:{
        dietaryRestrictions: [],
        otherRestriction: '',
        spiceLevel: 0,
        cuisinePreferences: {},
        foodPreferences: {},
        cookingMethodPreferences: {},
        additionalPreferences: '',
        showingCookingMethods: false
      }
};

const foodPreferencesSlice = createSlice({
  name: 'foodPreferences',
  initialState,
  reducers: {
    toggleDietaryRestriction: (state, action) => {
      const restriction = action.payload;
      const index = state.responses.dietaryRestrictions.indexOf(restriction);
      if (index === -1) {
        state.responses.dietaryRestrictions.push(restriction);
      } else {
        state.responses.dietaryRestrictions.splice(index, 1);
      }
    },

    setOtherRestriction: (state, action) => {
      state.responses.otherRestriction = action.payload;
    },

    setSpiceLevel: (state, action) => {
      state.responses.spiceLevel = action.payload;
    },

    togglePreference: (state, action) => {
      const { itemId, prefsKey } = action.payload;
      const preferences = state.responses[prefsKey];
      const currentPref = preferences[itemId] || 'neutral';
      
      if (currentPref === 'neutral') {
        preferences[itemId] = 'loved';
      } else if (currentPref === 'loved') {
        preferences[itemId] = 'hated';
      } else {
        preferences[itemId] = 'neutral';
      }
    },

    setAdditionalPreferences: (state, action) => {
      state.responses.additionalPreferences = action.payload;
    },

    toggleCookingMethodsView: (state, action) => {
      state.responses.showingCookingMethods = action.payload;
    },

    setResponses: (state, action) => {
      state.responses = action.payload;
    },
    
    clearResponses: (state) => {
      state.responses = {
        dietaryRestrictions: [],
        otherRestriction: '',
        spiceLevel: 0,
        cuisinePreferences: {},
        foodPreferences: {},
        cookingMethodPreferences: {},
        additionalPreferences: '',
        showingCookingMethods: false
      };
    }
  }
});

export const {
  toggleDietaryRestriction,
  setOtherRestriction,
  setSpiceLevel,
  togglePreference,
  setAdditionalPreferences,
  toggleCookingMethodsView,
  setResponses,
  clearResponses
} = foodPreferencesSlice.actions;

export default foodPreferencesSlice.reducer; 