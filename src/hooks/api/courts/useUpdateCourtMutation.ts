import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { CourtsQueryKey } from "./useCourtsQuery";
import { CourtQueryKey } from "./useCourtQuery";

interface UpdateCourtData {
  id: number;
  data: {
    name?: string;
    location_id?: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
  };
}

export default function useUpdateCourtMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, UpdateCourtData>({
    mutationFn: async ({ id, data }: UpdateCourtData) => {
      const response = await courtRepository.updateCourt(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CourtQueryKey(variables.id) });
      if (variables.data.location_id) {
        queryClient.invalidateQueries({ queryKey: CourtsQueryKey(variables.data.location_id) });
      }
    },
  });
}