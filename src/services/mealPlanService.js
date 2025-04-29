import axios from 'axios';
import { getAuthToken } from '../utils/auth';
const API_URL = 'http://localhost:8000/api/v1'; // Adjust to your backend URL

export const mealPlanService = {
  createMealPlan: async (userId, mealPlanData) => {
    const token = await getAuthToken();
    const response = await axios.post(`${API_URL}/users/${userId}/meal-plans`, mealPlanData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

