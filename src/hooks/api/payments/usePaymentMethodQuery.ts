import { useQuery } from '@tanstack/react-query';
import paymentRepository from '@/repository/paymentRepository';
import { IPaymentMethod } from '@/types/payment';

export const PaymentMethodQueryKey = (id?: number) => ['paymentMethod', id];

export default function usePaymentMethodQuery(id?: number) {
  return useQuery<IPaymentMethod>({
    queryKey: PaymentMethodQueryKey(id),
    queryFn: async () => {
      const response = await paymentRepository.getPaymentMethod(id!);
      return response.data.data;
    },
    enabled: !!id,
  });
}