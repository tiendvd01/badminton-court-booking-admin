import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationsQueryKey } from "./useLocationsQuery";

interface CreateLocationData {
  name: string;
  address: string;
  description?: string;
  owner_id: string;
}

export default function useCreateLocationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, CreateLocationData>({
    mutationFn: async (data: CreateLocationData) => {
      
      const response = await courtRepository.createLocation({
        ...data,
        owner_id: Number(data.owner_id),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LocationsQueryKey });
    },
  });
}