import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recommendedFoods: [],
  foodsToAvoid: [],
  loading: false,
  error: null
};

const foodsSlice = createSlice({
  name: 'foods',
  initialState,
  reducers: {
    setRecommendedFoods: (state, action) => {
      state.recommendedFoods = action.payload;
    },
    setFoodsToAvoid: (state, action) => {
      state.foodsToAvoid = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setRecommendedFoods, setFoodsToAvoid, setLoading, setError } = foodsSlice.actions;
export default foodsSlice.reducer; 