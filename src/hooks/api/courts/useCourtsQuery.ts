import { useQuery } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { ICourt } from "@/types/court";

export const CourtsQueryKey = () => ["courts"];

export default function useCourtsQuery(locationId?: number) {
  return useQuery<ICourt[]>({
    queryKey: CourtsQueryKey(),
    queryFn: async () => {
      const response = await courtRepository.getCourts(locationId);
      return response.data.data;
    },
    enabled: locationId !== undefined,
  });
}