import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  responses: {
    activeCompetitive: [],
    fitnessSkill: [],
    outdoorRelaxation: [],
    socialProfessional: [],
    dailyCognitive: []
  }
};

const lifestyleSlice = createSlice({
  name: 'lifestyle',
  initialState,
  reducers: {
    toggleResponse: (state, action) => {
      console.log(action.payload);
      const { category, subcategory } = action.payload;
      const categoryResponses = state.responses[category];
      const index = categoryResponses.indexOf(subcategory);
      
      if (index === -1) {
        categoryResponses.push(subcategory);
      } else {
        categoryResponses.splice(index, 1);
      }
    },
    
    setResponses: (state, action) => {
      state.responses = action.payload;
    },
    
    clearResponses: (state) => {
      state.responses = {
        activeCompetitive: [],
        fitnessSkill: [],
        outdoorRelaxation: [],
        socialProfessional: [],
        dailyCognitive: []
      };
    }
  }
});

export const {
  toggleResponse,
  setResponses,
  clearResponses
} = lifestyleSlice.actions;

export default lifestyleSlice.reducer; 