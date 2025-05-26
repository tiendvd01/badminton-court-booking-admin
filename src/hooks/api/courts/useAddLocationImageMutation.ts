import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationImagesQueryKey } from "./useLocationImagesQuery";

interface AddLocationImagesData {
  locationId: number;
  imageUrls: string[];
}

export default function useAddLocationImagesMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, AddLocationImagesData>({
    mutationFn: async (data: AddLocationImagesData) => {
      const response = await courtRepository.addLocationImages(data.locationId, data.imageUrls);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LocationImagesQueryKey(variables.locationId) });
    },
  });
}   