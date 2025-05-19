import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { CourtsQueryKey } from "./useCourtsQuery";

interface CreateCourtData {
  name: string;
  location_id: number;
  description?: string;
  image_url?: string;
  is_active?: boolean;
}

export default function useCreateCourtMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, CreateCourtData>({
    mutationFn: async (data: CreateCourtData) => {
      const response = await courtRepository.createCourt(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CourtsQueryKey(variables.location_id) });
    },
  });
}