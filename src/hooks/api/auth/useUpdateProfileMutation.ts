'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authRepository from "@/repository/authRepository";
import { IUser, useAuthStore } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { ProfileQueryKey } from "./useProfileQuery";

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

interface UpdateProfileResponse extends IResponse {
  data: IUser;
}

function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation<UpdateProfileResponse, AxiosError<IErrorResponse>, UpdateProfileData, unknown>({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await authRepository.updateProfile(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the user in the auth store
      setUser({ ...user, ...data.data });
      
      // Invalidate the profile query to refetch the latest user data
      queryClient.invalidateQueries({ queryKey: ProfileQueryKey });
    }
  });
}

export default useUpdateProfileMutation;