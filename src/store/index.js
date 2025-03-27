import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import foodsReducer from './foodsSlice';
import mealPlanReducer from './mealPlanSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    foods: foodsReducer,
    mealPlan: mealPlanReducer
  }
});

export default store; 