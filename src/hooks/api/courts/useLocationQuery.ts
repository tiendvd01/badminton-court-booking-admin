import { useQuery } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { ILocation } from "@/types/location";

export const LocationQueryKey = (id: number) => ["location", id];

export default function useLocationQuery(id: number) {
  return useQuery<ILocation>({
    queryKey: LocationQueryKey(id),
    queryFn: async () => {
      const response = await courtRepository.getLocation(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}