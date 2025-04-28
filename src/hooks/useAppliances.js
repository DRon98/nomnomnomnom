import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applianceService } from '../services/applianceService';

// Query key for kitchen appliances
const APPLIANCES_QUERY_KEY = 'appliances';

// Hook to fetch all appliances for a user
export const useUserAppliances = (userId) => {
  return useQuery({
    queryKey: [APPLIANCES_QUERY_KEY, userId],
    queryFn: () => applianceService.getUserAppliances(userId),
    enabled: !!userId, // Only run query if userId exists
  });
};

// Hook to add a new appliance
export const useAddAppliance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, appliance }) => 
      applianceService.addAppliance(userId, appliance),
    onSuccess: (data, variables) => {
      // Invalidate and refetch the appliances query after successful mutation
      queryClient.invalidateQueries({ 
        queryKey: [APPLIANCES_QUERY_KEY, variables.userId] 
      });
    },
  });
};

// Hook to delete an appliance
export const useDeleteAppliance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, applianceId }) => 
      applianceService.deleteAppliance(userId, applianceId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch the appliances query after successful deletion
      queryClient.invalidateQueries({ 
        queryKey: [APPLIANCES_QUERY_KEY, variables.userId] 
      });
    },
  });
};