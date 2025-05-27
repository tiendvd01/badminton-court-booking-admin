import { ICourt } from "./court";

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Booking {
  id: number;
  court_id: number;
  customer_info: {
    name: string;
    phone: string;
    email: string;
  };
  start_time: string;
  end_time: string;
  total_price: number;
  booking_date: string;
  status: BookingStatus;
  payment_image?: string;
  created_at: string;
  updated_at: string;
  court: ICourt;
}