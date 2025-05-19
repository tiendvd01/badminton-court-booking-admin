import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { CourtsQueryKey } from "./useCourtsQuery";

interface DeleteCourtContext {
  locationId?: number;
}

export default function useDeleteCourtMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, number, DeleteCourtContext>({
    mutationFn: async (id: number) => {
      const response = await courtRepository.deleteCourt(id);
      return response.data;
    },
    onSuccess: (_, __, context) => {
      if (context?.locationId) {
        queryClient.invalidateQueries({ queryKey: CourtsQueryKey(context.locationId) });
      }
    },
  });
}