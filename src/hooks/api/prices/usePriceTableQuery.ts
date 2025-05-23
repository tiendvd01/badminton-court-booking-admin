'use client'
import { useQuery } from "@tanstack/react-query";
import priceRepository from "@/repository/priceRepository";
import { IPriceTable } from "@/types/court";
import { IResponse } from "@/types/common";

interface PriceTableResponse extends IResponse {
  data: IPriceTable;
}

export const PriceTableQueryKey = (id?: number) => ['price-table', id];

export default function usePriceTableQuery(id?: number) {
  return useQuery<PriceTableResponse>({
    queryKey: PriceTableQueryKey(id),
    queryFn: async () => {
      const response = await priceRepository.getPriceTable(id);
      return response.data;
    },
    enabled: !!id,
  });
} 