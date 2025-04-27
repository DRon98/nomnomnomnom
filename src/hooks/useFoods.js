import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { foodService } from '../services/foodService';  

const FOODS_QUERY_KEY = 'foods';

export const useFoods = () => {
  return useQuery({
    queryKey: [FOODS_QUERY_KEY],
    queryFn: () => foodService.getFoods(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onSuccess: (data) => {
        console.log('Query fetched or retrieved from cache:', data);
      },
  });
};


