import { useQuery } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { ILocation } from "@/types/location";
import { useAuthStore } from "@/stores/authStore";

export const LocationsQueryKey = ["locations"];

export default function useLocationsQuery() {
  const { user } = useAuthStore();
  const isOwner = user?.role === 'owner';
  
  return useQuery<ILocation[]>({
    queryKey: LocationsQueryKey,
    queryFn: async () => {
      const response = await courtRepository.getLocations();
      // Filter locations by owner_id if the user is an owner
      const locations = response.data.data;
      return isOwner ? locations.filter(loc => loc.owner_id === user?.id) : locations;
    },
  });
}
