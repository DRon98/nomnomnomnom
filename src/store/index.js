import { configureStore } from '@reduxjs/toolkit';
import mealPlanReducer from './mealPlanSlice';
import userReducer from './userSlice';
import foodJournalReducer from './foodJournalSlice';
import inventoryReducer from './inventorySlice';
import foodsReducer from './foodsSlice';
import surveyReducer from './surveySlice';
import foodLogReducer from './foodLogSlice';
import kitchenAppliancesReducer from './kitchenAppliancesSlice';

const store = configureStore({
  reducer: {
    mealPlan: mealPlanReducer,
    user: userReducer,
    foodJournal: foodJournalReducer,
    inventory: inventoryReducer,
    foods: foodsReducer,
    survey: surveyReducer,
    foodLog: foodLogReducer,
    kitchenAppliances: kitchenAppliancesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;