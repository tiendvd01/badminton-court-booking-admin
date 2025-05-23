'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import priceRepository from "@/repository/priceRepository";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { PriceTableQueryKey } from "./usePriceTableQuery";
import { PriceTablesQueryKey } from "./usePriceTablesQuery";

interface DeletePriceTableResponse extends IResponse {
  data: { message: string };
}

export default function useDeletePriceTableMutation() {
  const queryClient = useQueryClient();

  return useMutation<DeletePriceTableResponse, AxiosError<IErrorResponse>, { id: number; ownerId?: number }, unknown>({
    mutationFn: async ({ id }) => {
      const response = await priceRepository.deletePriceTable(id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PriceTableQueryKey(variables.id) });
      if (variables.ownerId) {
        queryClient.invalidateQueries({ queryKey: PriceTablesQueryKey() });
      }
    },
  });
} 