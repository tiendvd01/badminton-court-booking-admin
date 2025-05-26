import { useMutation, useQueryClient } from '@tanstack/react-query';
import paymentRepository from '@/repository/paymentRepository';
import { PaymentMethodQueryKey } from './usePaymentMethodQuery';
import { PaymentMethodsQueryKey } from './usePaymentMethodsQuery';
import { AxiosError } from 'axios';
import { IErrorResponse } from '@/types/common';

interface UpdatePaymentMethodData {
  account_name?: string;
  payment_number?: string;
  bank_name?: string;
  qr_image?: string;
  owner_id?: string;
}

export default function useUpdatePaymentMethodMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, { id: number; data: UpdatePaymentMethodData }>({
    mutationFn: async ({ id, data }) => {
      const response = await paymentRepository.updatePaymentMethod(id, data);
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