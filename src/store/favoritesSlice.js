import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    recipes: []
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const { recipe_id } = action.payload;
      const existingIndex = state.recipes.findIndex(recipe => recipe.recipe_id === recipe_id);
      
      if (existingIndex >= 0) {
        state.recipes.splice(existingIndex, 1);
      } else {
        state.recipes.push(action.payload);
      }
    }
  }
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer; 