import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import foodsReducer from './foodsSlice';
import mealPlanReducer from './mealPlanSlice';
import inventoryReducer from './inventorySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    foods: foodsReducer,
    mealPlan: mealPlanReducer,
    inventory: inventoryReducer
  }
});

export default store;