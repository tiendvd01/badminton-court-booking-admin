'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authRepository from "@/repository/authRepository";
import { IUser, useAuthStore } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { ProfileQueryKey } from "./useProfileQuery";

interface UploadAvatarResponse extends IResponse {
  data: {
    avatar_url: string;
  };
}

function useUploadAvatarMutation() {
  const queryClient = useQueryClient();
  const { user, login } = useAuthStore();

  return useMutation<UploadAvatarResponse, AxiosError<IErrorResponse>, File, unknown>({
    mutationFn: async (file: File) => {
      const response = await authRepository.uploadAvatar(file);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the user in the auth store with the new avatar URL
      if (user) {
        const updatedUser: IUser = {
          ...user,
          avatar_url: data.data.avatar_url
        };
        
        // Get the current token from localStorage
        const token = localStorage.getItem('token') || '';
        
        // Update the user in the auth store
        login(updatedUser, token);
        
        // Invalidate the profile query to refetch the latest user data
        queryClient.invalidateQueries({ queryKey: ProfileQueryKey });
      }
    }
  });
}

export default useUploadAvatarMutation;