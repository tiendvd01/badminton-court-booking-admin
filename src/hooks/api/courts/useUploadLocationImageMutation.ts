import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationImagesQueryKey } from "./useLocationImagesQuery";

export default function useUploadLocationImageMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, { locationId: number, file: File }>({
    mutationFn: async ({ locationId, file }) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await courtRepository.uploadLocationImage(locationId, formData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the location images query to refetch the latest images
      queryClient.invalidateQueries({ queryKey: LocationImagesQueryKey(variables.locationId) });
    },
  });
}