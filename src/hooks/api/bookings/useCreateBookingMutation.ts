import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingRepository from "@/repository/bookingRepository";
import { BookingsQueryKey } from "./useBookingsQuery";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/types/common";

interface CreateBookingData {
  court_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  customer_info?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
}

export default function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, CreateBookingData>({
    mutationFn: async (data: CreateBookingData) => {
      const response = await bookingRepository.createBooking(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BookingsQueryKey() });
    },
  });
}
