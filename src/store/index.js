import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import foodsReducer from './foodsSlice';
import mealPlanReducer from './mealPlanSlice';
import inventoryReducer from './inventorySlice';
import foodJournalReducer from './foodJournalSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    foods: foodsReducer,
    mealPlan: mealPlanReducer,
    inventory: inventoryReducer,
    foodJournal: foodJournalReducer
  }
});

export default store;