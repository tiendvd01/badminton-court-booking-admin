'use client'
import { useQuery } from "@tanstack/react-query";
import priceRepository from "@/repository/priceRepository";
import { IPriceTable } from "@/types/court";
import { IResponse } from "@/types/common";

interface PriceTablesResponse extends IResponse {
  data: IPriceTable[];
}

export const PriceTablesQueryKey = () => ['price-tables'];

export default function usePriceTablesQuery(ownerId?: number) {
  return useQuery<PriceTablesResponse>({
    queryKey: PriceTablesQueryKey(),
    queryFn: async () => {
      const response = await priceRepository.getPriceTables(ownerId);
      return response.data;
    },
  });
} 