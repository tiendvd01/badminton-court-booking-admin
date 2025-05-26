
import httpService from '@/lib/httpService';

class PaymentRepository {
  // Create a new payment method
  async createPaymentMethod(data: {
    account_name: string;
    payment_number: string;
    bank_code: string;
    bank_info: object;
    qr_image: string;
    owner_id?: string;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/owner-payments`, data);
  }

  // Get all payment methods (with optional owner filter)
  async getPaymentMethods(ownerId?: string) {
    const url = ownerId
      ? `${process.env.NEXT_PUBLIC_API_URL}/owner-payments?ownerId=${ownerId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/owner-payments`;
    return httpService.get(url);
  }

  // Get a specific payment method by ID
  async getPaymentMethod(id: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/owner-payments/${id}`);
  }

  // Update a payment method
  async updatePaymentMethod(
    id: number,
    data: {
      account_name?: string;
      payment_number?: string;
      bank_name?: string;
      qr_image?: string;
      owner_id?: string;
    },
  ) {
    return httpService.put(`${process.env.NEXT_PUBLIC_API_URL}/owner-payments/${id}`, data);
  }

  // Delete a payment method
  async deletePaymentMethod(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/owner-payments/${id}`);
  }

  // Toggle active status of a payment method
  async togglePaymentMethodActive(id: number, isActive: boolean) {
    return httpService.put(`${process.env.NEXT_PUBLIC_API_URL}/owner-payments/${id}/toggle-active`, {
      is_active: isActive,
    });
  }
}

const paymentRepository = new PaymentRepository();
export default paymentRepository;

