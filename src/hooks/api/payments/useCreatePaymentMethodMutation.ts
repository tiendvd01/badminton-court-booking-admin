import { useMutation, useQueryClient } from '@tanstack/react-query';
import paymentRepository from '@/repository/paymentRepository';
import { PaymentMethodsQueryKey } from './usePaymentMethodsQuery';
import { AxiosError } from 'axios';
import { IErrorResponse } from '@/types/common';

interface CreatePaymentMethodData {
  account_name: string;
  payment_number: string;
  bank_code: string;
  bank_info: object;
  owner_id?: string;
}

export default function useCreatePaymentMethodMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, CreatePaymentMethodData>({
    mutationFn: async (data: CreatePaymentMethodData) => {
      const response = await paymentRepository.createPaymentMethod(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate payment methods queries
      queryClient.invalidateQueries({ queryKey: PaymentMethodsQueryKey() });
      if (variables.owner_id) {
        queryClient.invalidateQueries({ queryKey: PaymentMethodsQueryKey(variables.owner_id) });
      }
    },
  });
}