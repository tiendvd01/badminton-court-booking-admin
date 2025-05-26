import { useMutation, useQueryClient } from '@tanstack/react-query';
import paymentRepository from '@/repository/paymentRepository';
import { PaymentMethodsQueryKey } from './usePaymentMethodsQuery';
import { AxiosError } from 'axios';
import { IErrorResponse } from '@/types/common';

export default function useDeletePaymentMethodMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, number>({
    mutationFn: async (id: number) => {
      const response = await paymentRepository.deletePaymentMethod(id);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate payment methods list
      queryClient.invalidateQueries({ queryKey: PaymentMethodsQueryKey() });
    },
  });
}