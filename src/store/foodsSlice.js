import { createSlice } from '@reduxjs/toolkit';
import { FOOD_CATEGORIES } from '../constants';

// Normalized state structure
const initialState = {
  // Entities
  byId: {},
  // References
  allIds: [],
  // Categories
  categories: Object.values(FOOD_CATEGORIES),
  // UI state
  loading: false,
  error: null,
  // Filtered lists
  recommendedFoods: [],
  foodsToAvoid: [],
  // Search and filters
  searchTerm: '',
  activeFilters: {
    categories: [],
    dietaryRestrictions: []
  },
  selectedFoods: [],
};

const foodsSlice = createSlice({
  name: 'foods',
  initialState,
  reducers: {
    // Add a single food item
    addFood: (state, action) => {
      const food = action.payload;
      state.byId[food.id] = food;
      if (!state.allIds.includes(food.id)) {
        state.allIds.push(food.id);
      }
    },
    
    // Add multiple food items
    addFoods: (state, action) => {
      const foods = action.payload;
      foods.forEach(food => {
        state.byId[food.id] = food;
        if (!state.allIds.includes(food.id)) {
          state.allIds.push(food.id);
        }
      });
    },
    
    // Update a food item
    updateFood: (state, action) => {
      const { id, ...updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    
    // Remove a food item
    removeFood: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter(foodId => foodId !== id);
    },
    
    // Set recommended foods (by IDs)
    setRecommendedFoods: (state, action) => {
      state.recommendedFoods = action.payload;
    },
    
    // Set foods to avoid (by IDs)
    setFoodsToAvoid: (state, action) => {
      state.foodsToAvoid = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Set search term
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    // Set active filters
    setActiveFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.searchTerm = '';
      state.activeFilters = {
        categories: [],
        dietaryRestrictions: []
      };
    },
    
    setSelectedFoods: (state, action) => {
      state.selectedFoods = action.payload;
    },
    
    clearSelectedFoods: (state) => {
      state.selectedFoods = [];
    },
  }
});

// Selectors
export const selectAllFoods = state => state.foods.allIds.map(id => state.foods.byId[id]);
export const selectFoodById = (state, id) => state.foods.byId[id];
export const selectRecommendedFoods = state => 
  state.foods.recommendedFoods.map(id => state.foods.byId[id]).filter(Boolean);
export const selectFoodsToAvoid = state => 
  state.foods.foodsToAvoid.map(id => state.foods.byId[id]).filter(Boolean);
export const selectFoodsByCategory = (state, category) => 
  state.foods.allIds
    .map(id => state.foods.byId[id])
    .filter(food => food.category === category);

export const { 
  addFood, 
  addFoods, 
  updateFood, 
  removeFood,
  setRecommendedFoods, 
  setFoodsToAvoid, 
  setLoading, 
  setError,
  setSearchTerm,
  setActiveFilters,
  clearFilters,
  setSelectedFoods,
  clearSelectedFoods
} = foodsSlice.actions;

export default foodsSlice.reducer; 