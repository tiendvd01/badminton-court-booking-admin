import { useMutation, useQueryClient } from '@tanstack/react-query';
import paymentRepository from '@/repository/paymentRepository';
import { PaymentMethodsQueryKey } from './usePaymentMethodsQuery';
import { AxiosError } from 'axios';
import { IErrorResponse } from '@/types/common';
import { PaymentMethodQueryKey } from './usePaymentMethodQuery';

export default function useTogglePaymentMethodActiveMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, { id: number; isActive: boolean }>({
    mutationFn: async ({ id, isActive }) => {
      const response = await paymentRepository.togglePaymentMethodActive(id, isActive);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific payment method query
      queryClient.invalidateQueries({ queryKey: PaymentMethodQueryKey(variables.id) });
      // Invalidate payment methods list
      queryClient.invalidateQueries({ queryKey: PaymentMethodsQueryKey() });
    },
  });
}