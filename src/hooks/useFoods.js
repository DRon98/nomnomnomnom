import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { foodService } from '../services/foodService';  
import { getAuthToken } from '../utils/auth';

const FOODS_QUERY_KEY = 'foods';

export const useFoods = () => {
  return useQuery({
    queryKey: [FOODS_QUERY_KEY],
    queryFn: async () => {
      const token = await getAuthToken();
   
      return foodService.getFoods(token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    onSuccess: (data) => {
      console.log('Query fetched or retrieved from cache:', data);
    },
  });
};


