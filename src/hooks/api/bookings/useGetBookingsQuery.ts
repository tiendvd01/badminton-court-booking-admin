import { useQuery } from '@tanstack/react-query';
import bookingRepository from '@/repository/bookingRepository';
import { BookingStatus } from '@/types/booking';

interface BookingResponse {
  data: Array<{
    id: number;
    slots: Array<{
      court_id: number;
      start_time: string;
      end_time: string;
    }>;
    // Add other booking properties as needed
  }>;
}

interface GetBookingsParams {
  locationId?: number;
  status?: BookingStatus[];
  bookingDate?: string;
}

export const BookingsQueryKey = (params?: GetBookingsParams) => ['bookings', params];

export function useGetBookingsQuery(params?: GetBookingsParams) {
  return useQuery<BookingResponse>({
    queryKey: BookingsQueryKey(params),
    queryFn: async () => {
      // Convert status array to comma-separated string if it exists
      const statusQuery = params?.status?.join(',');
      
      // Call the repository with the filters
      const response = await bookingRepository.getAllBookings({
        status: statusQuery,
        bookingDate: params?.bookingDate,
        ...(params?.locationId && { locationId: params.locationId.toString() })
      });
      
      return response.data;
    },
    enabled: !!(params?.locationId || params?.bookingDate),
  });
}

export default useGetBookingsQuery;
