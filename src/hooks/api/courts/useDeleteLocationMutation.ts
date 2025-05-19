import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationsQueryKey } from "./useLocationsQuery";

export default function useDeleteLocationMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, number>({
    mutationFn: async (id: number) => {
      const response = await courtRepository.deleteLocation(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LocationsQueryKey });
    },
  });
}