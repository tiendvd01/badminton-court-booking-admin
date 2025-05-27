import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingRepository from "@/repository/bookingRepository";
import { BookingQueryKey } from "./useBookingQuery";
import { BookingsQueryKey } from "./useBookingsQuery";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/types/common";
import { BookingStatus } from "@/types/booking";

interface UpdateBookingData {
  court_id?: number;
  start_time?: string;
  end_time?: string;
  total_price?: number;
  customer_info: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
  status?: BookingStatus;
}

export default function useUpdateBookingMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, { id: number; data: UpdateBookingData }>({
    mutationFn: async ({ id, data }) => {
      const response = await bookingRepository.updateBooking(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BookingQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: BookingsQueryKey() });
    },
  });
}