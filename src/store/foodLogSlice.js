import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consumed: {}, // { date: { meal: [foods] } }
  responses: {}, // { date: { meal: { questionId: response } } }
};

const foodLogSlice = createSlice({
  name: 'foodLog',
  initialState,
  reducers: {
    addConsumedFood: (state, action) => {
      const { date, meal, food } = action.payload;
      if (!state.consumed[date]) {
        state.consumed[date] = {};
      }
      if (!state.consumed[date][meal]) {
        state.consumed[date][meal] = [];
      }
      state.consumed[date][meal].push(food);
    },
    
    removeConsumedFood: (state, action) => {
      const { date, meal, foodId } = action.payload;
      if (state.consumed[date]?.[meal]) {
        state.consumed[date][meal] = state.consumed[date][meal].filter(
          food => food.id !== foodId
        );
      }
    },

    updateMealResponses: (state, action) => {
      const { date, meal, responses } = action.payload;
      if (!state.responses[date]) {
        state.responses[date] = {};
      }
      state.responses[date][meal] = {
        ...state.responses[date][meal],
        ...responses
      };
    },

    clearMealResponses: (state, action) => {
      const { date, meal } = action.payload;
      if (state.responses[date]) {
        delete state.responses[date][meal];
      }
    },

    clearDateResponses: (state, action) => {
      const { date } = action.payload;
      delete state.responses[date];
      delete state.consumed[date];
    }
  }
});

export const {
  addConsumedFood,
  removeConsumedFood,
  updateMealResponses,
  clearMealResponses,
  clearDateResponses
} = foodLogSlice.actions;

export default foodLogSlice.reducer; 