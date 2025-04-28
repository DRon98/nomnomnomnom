import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userLifestyleService from '../services/userLifestyleService';
import { getCurrentUserId } from '../utils/auth';

export const useLifestyle = (userId) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['userLifestyle', userId],
        queryFn: () => userLifestyleService.getUserLifestyle(userId),
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: (lifestyleData) => userLifestyleService.updateUserLifestyle(userId, lifestyleData),
        onSuccess: (data) => {
            // Invalidate and refetch the lifestyle query
            queryClient.invalidateQueries(['userLifestyle', userId]);
        },
    });

    return {
        ...query,
        updateLifestyle: mutation.mutate,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};