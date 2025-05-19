import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationImagesQueryKey } from "./useLocationImagesQuery";

interface DeleteLocationImageContext {
  locationId: number;
}

export default function useDeleteLocationImageMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, { id: number, locationId: number }, DeleteLocationImageContext>({
    mutationFn: async ({ id }) => {
      const response = await courtRepository.deleteLocationImage(id);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the location images query to refetch the latest images
      queryClient.invalidateQueries({ queryKey: LocationImagesQueryKey(variables.locationId) });
    },
  });
}