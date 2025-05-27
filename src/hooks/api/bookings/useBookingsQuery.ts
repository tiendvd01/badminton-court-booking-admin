import { useQuery } from '@tanstack/react-query';
import bookingRepository from '@/repository/bookingRepository';
import { Booking } from '@/types/booking';
import { IResponse } from '@/types/common';

export const BookingsQueryKey = (params?: BookingsQueryParams) => ['bookings', params];

interface BookingsResponse extends IResponse {
  data: Booking[];
}

interface BookingsQueryParams {
  locationId?: number;
  courtId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export default function useBookingsQuery(params?: BookingsQueryParams) {
  return useQuery<BookingsResponse>({
    queryKey: BookingsQueryKey(params),
    queryFn: async () => {
      const response = await bookingRepository.getAllBookings(params);
      return response.data;
    },
  });
}
