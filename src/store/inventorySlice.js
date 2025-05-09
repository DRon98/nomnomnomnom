import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pantry: [], // [{foodId, food, amount}]
  groceries: [], // [{foodId, food, amount}]
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addToPantry: (state, action) => {
      const { food, amount = 1 } = action.payload;
      const existingItem = state.pantry.find(item => item.foodId === food.id);
      if (existingItem) {
        existingItem.amount += amount;
      } else {
        state.pantry.push({
          foodId: food.id,
          food: {
            ...food
          },
          amount
        });
      }
    },
    removeFromPantry: (state, action) => {
      const { foodId } = action.payload;
      state.pantry = state.pantry.filter(item => item.foodId !== foodId);
    },
    updatePantryAmount: (state, action) => {
      const { foodId, amount } = action.payload;
      const item = state.pantry.find(item => item.foodId === foodId);
      if (item) {
        item.amount = amount;
      }
    },
    addToGroceries: (state, action) => {
      const { food, amount = 1 } = action.payload;
      
      // If the food has base ingredients, add them instead
      if (food.base_ingredients_for_grocery_list && food.base_ingredients_for_grocery_list.length > 0) {
        food.base_ingredients_for_grocery_list.forEach(ingredient => {
          const existingItem = state.groceries.find(item => 
            item.food.name.toLowerCase() === ingredient.toLowerCase()
          );
          
          if (existingItem) {
            existingItem.amount += amount;
          } else {
            state.groceries.push({
              foodId: `${food.id}_${ingredient}`,
              food: {
                id: `${food.id}_${ingredient}`,
                name: ingredient,
                category: food.category || 'other',
                unit: 'unit'
              },
              amount
            });
          }
        });
      } else {
        // Fallback to adding the food itself if no base ingredients
        const existingItem = state.groceries.find(item => item.foodId === food.id);
        if (existingItem) {
          existingItem.amount += amount;
        } else {
          state.groceries.push({
            foodId: food.id,
            food: {
              ...food
            },
            amount
          });
        }
      }
    },
    removeFromGroceries: (state, action) => {
      const { foodId } = action.payload;
      state.groceries = state.groceries.filter(item => item.foodId !== foodId);
    },
    updateGroceryAmount: (state, action) => {
      const { foodId, amount } = action.payload;
      const item = state.groceries.find(item => item.foodId === foodId);
      if (item) {
        item.amount = amount;
      }
    },
    clearGroceries: (state) => {
      state.groceries = [];
    },
    clearPantry: (state) => {
      state.pantry = [];
    }
  }
});

export const {
  addToPantry,
  removeFromPantry,
  updatePantryAmount,
  addToGroceries,
  removeFromGroceries,
  updateGroceryAmount,
  clearGroceries,
  clearPantry
} = inventorySlice.actions;

export default inventorySlice.reducer;