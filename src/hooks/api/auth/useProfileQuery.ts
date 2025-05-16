
'use client'
import { useQuery } from "@tanstack/react-query";
import authRepository from "@/repository/authRepository";
import { IUser } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";

export const ProfileQueryKey = ['profile'];

export interface ProfileResponse extends IResponse {
  data: {
    user: IUser;
  };
}

function useProfileQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<ProfileResponse, IErrorResponse>({
    queryKey: ProfileQueryKey,
    queryFn: async () => {
      const response = await authRepository.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes,
    enabled,
  });
}

export default useProfileQuery;

