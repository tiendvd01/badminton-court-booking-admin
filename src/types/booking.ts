
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Booking {
  id: number;
  customer_info: {
    name: string;
    phone_number: string;
  };
  booking_code: string;
  booking_date: string;
  slots: {
    court_id: number;
    start_time: string;
    end_time: string;
  }[];
  total_price: number;
  note?: string;
  status: string;
  payment_image?: string;
  created_at: string;
  updated_at: string;
}