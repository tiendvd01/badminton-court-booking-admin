
import httpService from '@/lib/httpService';
import { BookingStatus } from '@/types/booking';

interface CreateBookingData {
  court_id: number;
  user_id?: number;
  start_time: string;
  end_time: string;
  total_price: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  notes?: string;
}

interface UpdateBookingData {
  court_id?: number;
  user_id?: number;
  start_time?: string;
  end_time?: string;
  total_price?: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  notes?: string;
  status?: BookingStatus;
}

class BookingRepository {
  // Create a new booking
  async createBooking(data: CreateBookingData) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, data);
  }

  // Get all bookings
  async getAllBookings(filters?: {
    customerName?: string;
    bookingDate?: string;
    status?: string;
  }) {
    const params = new URLSearchParams();
    
    if (filters?.customerName) {
      params.append('customerName', filters.customerName);
    }
    
    if (filters?.bookingDate) {
      params.append('bookingDate', filters.bookingDate);
    }
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings${queryString}`);
  }

  // Get a specific booking by ID
  async getBookingById(id: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`);
  }

  // Update a booking
  async updateBooking(id: number, data: UpdateBookingData) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, data);
  }

  // Update booking status
  async updateBookingStatus(id: number, status: BookingStatus) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/status`, { status });
  }

  // Delete a booking
  async deleteBooking(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`);
  }
}

const bookingRepository = new BookingRepository();
export default bookingRepository;
