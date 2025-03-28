import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consumedFoods: [], // [{foodId, food, servings, date}]
};

const foodJournalSlice = createSlice({
  name: 'foodJournal',
  initialState,
  reducers: {
    addFoodConsumption: (state, action) => {
      const { food, servings = 1, date = new Date().toISOString().split('T')[0] } = action.payload;
      const existingEntry = state.consumedFoods.find(
        entry => entry.foodId === food.id && entry.date === date
      );
      
      if (existingEntry) {
        existingEntry.servings += servings;
      } else {
        state.consumedFoods.push({
          foodId: food.id,
          food: {
            ...food
          },
          servings,
          date
        });
      }
    },
    updateFoodServings: (state, action) => {
      const { foodId, servings, date } = action.payload;
      const entry = state.consumedFoods.find(
        entry => entry.foodId === foodId && entry.date === date
      );
      
      if (entry) {
        entry.servings = servings;
      }
    },
    removeFoodConsumption: (state, action) => {
      const { foodId, date } = action.payload;
      state.consumedFoods = state.consumedFoods.filter(
        entry => !(entry.foodId === foodId && entry.date === date)
      );
    },
    clearFoodJournal: (state) => {
      state.consumedFoods = [];
    }
  }
});

export const {
  addFoodConsumption,
  updateFoodServings,
  removeFoodConsumption,
  clearFoodJournal
} = foodJournalSlice.actions;

export default foodJournalSlice.reducer;