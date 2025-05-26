import { useQuery } from '@tanstack/react-query';
import paymentRepository from '@/repository/paymentRepository';
import { IPaymentMethod } from '@/types/payment';

export const PaymentMethodsQueryKey = (ownerId?: string) => ['paymentMethods', ownerId];

export default function usePaymentMethodsQuery(ownerId?: string) {
  return useQuery<IPaymentMethod[]>({
    queryKey: PaymentMethodsQueryKey(ownerId),
    queryFn: async () => {
      const response = await paymentRepository.getPaymentMethods(ownerId);
      return response.data.data;
    },
  });
}