import { configureStore } from '@reduxjs/toolkit';
import mealPlanReducer from './mealPlanSlice';
import userReducer from './userSlice';
import inventoryReducer from './inventorySlice';
import foodsReducer from './foodsSlice';
import surveyReducer from './surveySlice';
import kitchenAppliancesReducer from './kitchenAppliancesSlice';
import lifestyleReducer from './lifestyleSlice';
import foodPreferencesReducer from './foodPreferencesSlice';
import calendarReducer from './calendarSlice';
import scheduleDataReducer from './scheduleDataSlice';
import mealTrackingReducer from './mealTrackingSlice'; // Import the new reducer

const store = configureStore({
  reducer: {
    mealPlan: mealPlanReducer,
    user: userReducer,
    inventory: inventoryReducer,
    foods: foodsReducer,
    survey: surveyReducer,
    kitchenAppliances: kitchenAppliancesReducer,
    lifestyle: lifestyleReducer,
    foodPreferences: foodPreferencesReducer,
    calendar: calendarReducer,
    scheduleData: scheduleDataReducer,
    mealTracking: mealTrackingReducer // Add the new reducer to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;