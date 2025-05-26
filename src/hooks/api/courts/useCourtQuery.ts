import { useQuery } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { ICourt } from "@/types/court";

export const CourtQueryKey = (id?: number) => ["court", id];

export default function useCourtQuery(id?: number) {
  return useQuery<ICourt>({
    queryKey: CourtQueryKey(id),
    queryFn: async () => {
      const response = await courtRepository.getCourt(id ?? NaN);
      return response.data.data;
    },
    enabled: !!id,
  });
}