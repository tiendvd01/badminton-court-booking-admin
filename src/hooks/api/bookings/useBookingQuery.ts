import { useQuery } from "@tanstack/react-query";
import bookingRepository from "@/repository/bookingRepository";
import { Booking } from "@/types/booking";

export const BookingQueryKey = (id?: number) => ["booking", id];

export default function useBookingQuery(id?: number) {
  return useQuery<Booking>({
    queryKey: BookingQueryKey(id),
    queryFn: async () => {
      const response = await bookingRepository.getBookingById(id!);
      return response.data.data;
    },
    enabled: !!id,
  });
}