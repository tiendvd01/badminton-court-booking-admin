import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingRepository from "@/repository/bookingRepository";
import { BookingQueryKey } from "./useBookingQuery";
import { BookingsQueryKey } from "./useBookingsQuery";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/types/common";
import { BookingStatus } from "@/types/booking";

export default function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, { id: number; status: BookingStatus }>({
    mutationFn: async ({ id, status }) => {
      const response = await bookingRepository.updateBookingStatus(id, status);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BookingQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: BookingsQueryKey() });
    },
  });
}