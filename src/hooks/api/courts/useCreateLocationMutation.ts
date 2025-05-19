import { useMutation, useQueryClient } from "@tanstack/react-query";
import courtRepository from "@/repository/courtRepository";
import { LocationsQueryKey } from "./useLocationsQuery";
import { useAuthStore } from "@/stores/authStore";

interface CreateLocationData {
  name: string;
  address: string;
  description?: string;
  image_url?: string;
}

export default function useCreateLocationMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation<any, Error, CreateLocationData>({
    mutationFn: async (data: CreateLocationData) => {
      if (!user?.id) throw new Error("User ID is required");
      
      const response = await courtRepository.createLocation({
        ...data,
        owner_id: user.id
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LocationsQueryKey });
    },
  });
}