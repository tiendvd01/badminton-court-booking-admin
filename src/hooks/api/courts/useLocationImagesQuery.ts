import { useQuery } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { ILocationImage } from "@/types/location";

export const LocationImagesQueryKey = (locationId: number) => ["location-images", locationId];

export default function useLocationImagesQuery(locationId: number) {
  return useQuery<ILocationImage[]>({
    queryKey: LocationImagesQueryKey(locationId),
    queryFn: async () => {
      const response = await courtRepository.getLocationImages(locationId);
      return response.data.data;
    },
    enabled: !!locationId,
  });
}