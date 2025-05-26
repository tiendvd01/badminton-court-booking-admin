import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { CourtsQueryKey } from "./useCourtsQuery";

interface CreateCourtData {
  name: string;
  location_id: number;
  description?: string;
  is_active?: boolean;
  price_table_id?: number;
}

export default function useCreateCourtMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, CreateCourtData>({
    mutationFn: async (data: CreateCourtData) => {
      const response = await courtRepository.createCourt(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CourtsQueryKey() });
    },
  });
}