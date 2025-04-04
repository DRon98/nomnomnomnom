import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Legacy state for backward compatibility
  consumedFoods: [], // [{foodId, food, servings, date}]
  
  // New state structure
  dailyEntries: [], // [{date, mealType, foodId, food, servings, mood, timestamp}]
  weeklySummaries: [], // [{weekStart, dateEntries, satisfaction, prepMethod, energy, notes}]
  streakCount: 0,
  lastEntryDate: null
};

const foodJournalSlice = createSlice({
  name: 'foodJournal',
  initialState,
  reducers: {
    // Legacy reducers
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
          food: { ...food },
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
      state.dailyEntries = [];
      state.weeklySummaries = [];
      state.streakCount = 0;
      state.lastEntryDate = null;
    },

    // New reducers for enhanced food journal
    addDailyEntry: (state, action) => {
      const { date, mealType, food, servings, mood } = action.payload;
      
      // Add to dailyEntries
      state.dailyEntries.push({
        date,
        mealType,
        foodId: food.id,
        food: { ...food },
        servings,
        mood,
        timestamp: Date.now()
      });

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (!state.lastEntryDate) {
        state.streakCount = 1;
      } else if (state.lastEntryDate === yesterday) {
        state.streakCount += 1;
      } else if (state.lastEntryDate !== today) {
        state.streakCount = 1;
      }
      
      state.lastEntryDate = today;

      // Add to legacy consumedFoods for backward compatibility
      const existingConsumption = state.consumedFoods.find(
        entry => entry.foodId === food.id && entry.date === date
      );
      
      if (existingConsumption) {
        existingConsumption.servings += servings;
      } else {
        state.consumedFoods.push({
          foodId: food.id,
          food: { ...food },
          servings,
          date
        });
      }
    },

    addWeeklySummary: (state, action) => {
      const { weekStart, dateEntries, satisfaction, prepMethod, energy, notes } = action.payload;
      
      // Find existing summary for the week
      const existingIndex = state.weeklySummaries.findIndex(
        summary => summary.weekStart === weekStart
      );
      
      const summaryData = {
        weekStart,
        dateEntries,
        satisfaction,
        prepMethod,
        energy,
        notes,
        timestamp: Date.now()
      };
      
      if (existingIndex !== -1) {
        state.weeklySummaries[existingIndex] = summaryData;
      } else {
        state.weeklySummaries.push(summaryData);
      }
    },

    updateDailyEntry: (state, action) => {
      const { date, mealType, foodId, updates } = action.payload;
      const entry = state.dailyEntries.find(
        e => e.date === date && e.mealType === mealType && e.foodId === foodId
      );
      
      if (entry) {
        Object.assign(entry, updates);
        
        // Update legacy consumedFoods if servings changed
        if (updates.servings !== undefined) {
          const consumption = state.consumedFoods.find(
            c => c.foodId === foodId && c.date === date
          );
          if (consumption) {
            consumption.servings = updates.servings;
          }
        }
      }
    },

    removeDailyEntry: (state, action) => {
      const { date, mealType, foodId } = action.payload;
      state.dailyEntries = state.dailyEntries.filter(
        entry => !(entry.date === date && entry.mealType === mealType && entry.foodId === foodId)
      );
      
      // Remove from legacy consumedFoods
      state.consumedFoods = state.consumedFoods.filter(
        entry => !(entry.foodId === foodId && entry.date === date)
      );
    },

    // New quick journal entry reducer
    addQuickJournalEntry: (state, action) => {
      const {
        date,
        recommendedFoodConsumption,
        foodsEaten = [],
        foodsNotEaten = [],
        otherFoods = [],
        followedMealTimes,
        followedTip,
        entryType
      } = action.payload;

      // Add to dailyEntries with quick journal type
      state.dailyEntries.push({
        date,
        recommendedFoodConsumption,
        foodsEaten,
        foodsNotEaten,
        otherFoods,
        followedMealTimes,
        followedTip,
        entryType,
        timestamp: Date.now()
      });

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (!state.lastEntryDate) {
        state.streakCount = 1;
      } else if (state.lastEntryDate === yesterday) {
        state.streakCount += 1;
      } else if (state.lastEntryDate !== today) {
        state.streakCount = 1;
      }
      
      state.lastEntryDate = today;

      // Add consumed foods to legacy state
      [...foodsEaten, ...otherFoods].forEach(food => {
        const existingConsumption = state.consumedFoods.find(
          entry => entry.foodId === food.id && entry.date === date
        );
        
        if (existingConsumption) {
          existingConsumption.servings += 1;
        } else {
          state.consumedFoods.push({
            foodId: food.id,
            food: { ...food },
            servings: 1,
            date
          });
        }
      });
    }
  }
});

export const {
  // Legacy actions
  addFoodConsumption,
  updateFoodServings,
  removeFoodConsumption,
  clearFoodJournal,
  // New actions
  addDailyEntry,
  addWeeklySummary,
  updateDailyEntry,
  removeDailyEntry,
  addQuickJournalEntry
} = foodJournalSlice.actions;

export default foodJournalSlice.reducer;