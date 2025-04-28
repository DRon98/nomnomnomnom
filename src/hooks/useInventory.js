import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from "../services/inventoryService";



export const useInventory = (userId, inv_type) => {
  return useQuery({
    queryKey: ['inventory', userId, inv_type],
    queryFn: () => inventoryService.getInventory(userId, inv_type),
    enabled: !!userId,
  });
};

export const usePutInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, inv_type, payload }) =>
      inventoryService.putInventory(userId, inv_type, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.userId, variables.inv_type] });
    },
  });
};
