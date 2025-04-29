import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mealPlanService } from '../services/mealPlanService';

export const useCreateMealPlan = () => {

  return useMutation({
    mutationFn: ({userId, mealPlanData}) => mealPlanService.createMealPlan(userId, mealPlanData),
  });       
};  
