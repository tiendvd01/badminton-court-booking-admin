import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingRepository from "@/repository/bookingRepository";
import { BookingsQueryKey } from "./useBookingsQuery";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/types/common";

export default function useDeleteBookingMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, AxiosError<IErrorResponse>, number>({
    mutationFn: async (id: number) => {
      const response = await bookingRepository.deleteBooking(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BookingsQueryKey() });
    },
  });
}