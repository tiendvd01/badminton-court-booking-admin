import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationsQueryKey } from "./useLocationsQuery";
import { LocationQueryKey } from "./useLocationQuery";

interface UpdateLocationData {
  id: number;
  data: {
    name?: string;
    address?: string;
    description?: string;
    image_url?: string;
    logo?: string;
    owner_id?: string;
    min_shift_time?: number;
  };
}

export default function useUpdateLocationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, UpdateLocationData>({
    mutationFn: async ({ id, data }: UpdateLocationData) => {
      const response = await courtRepository.updateLocation(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LocationsQueryKey });
      queryClient.invalidateQueries({ queryKey: LocationQueryKey(variables.id) });
    },
  });
}