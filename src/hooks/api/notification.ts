import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationRepository from '../../repository/notificationRepository';

// Query hook for getting user notifications
export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationRepository.getUserNotifications(),
  });
}

// Mutation hook for marking a notification as read
export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationRepository.markAsRead(id),
    onSuccess: () => {
      // Invalidate and refetch notifications after marking as read
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Mutation hook for marking all notifications as read
export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationRepository.markAllAsRead(),
    onSuccess: () => {
      // Invalidate and refetch notifications after marking all as read
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
