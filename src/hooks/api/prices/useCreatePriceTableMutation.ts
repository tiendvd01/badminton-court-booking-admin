'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import priceRepository from "@/repository/priceRepository";
import { IPrice, IPriceTable } from "@/types/court";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { PriceTablesQueryKey } from "./usePriceTablesQuery";

interface CreatePriceTableData {
  name: string;
  description?: string;
  owner_id: number;
  prices: IPrice[];
}

interface CreatePriceTableResponse extends IResponse {
  data: IPriceTable;
}

export default function useCreatePriceTableMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreatePriceTableResponse, AxiosError<IErrorResponse>, CreatePriceTableData, unknown>({
    mutationFn: async (data: CreatePriceTableData) => {
      const response = await priceRepository.createPriceTable(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PriceTablesQueryKey() });
    },
  });
} 