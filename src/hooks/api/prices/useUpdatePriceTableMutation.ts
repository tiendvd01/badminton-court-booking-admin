'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import priceRepository from "@/repository/priceRepository";
import { IPrice, IPriceTable } from "@/types/court";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { PriceTableQueryKey } from "./usePriceTableQuery";
import { PriceTablesQueryKey } from "./usePriceTablesQuery";

interface UpdatePriceTableData {
  name?: string;
  description?: string;
  owner_id?: number;
  prices: IPrice[];
}

interface UpdatePriceTableResponse extends IResponse {
  data: IPriceTable;
}

export default function useUpdatePriceTableMutation() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePriceTableResponse, AxiosError<IErrorResponse>, { id: number; data: UpdatePriceTableData }, unknown>({
    mutationFn: async ({ id, data }) => {
      const response = await priceRepository.updatePriceTable(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PriceTableQueryKey(variables.id) });
      if (variables.data.owner_id) {
        queryClient.invalidateQueries({ queryKey: PriceTablesQueryKey() });
      }
    },
  });
} 