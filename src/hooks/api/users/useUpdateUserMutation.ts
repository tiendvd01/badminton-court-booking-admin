'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userRepository from "@/repository/userRepository";
import { IUser } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { UsersQueryKey } from "../auth/useUsersQuery";

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

interface UpdateUserResponse extends IResponse {
  data: IUser;
}

function useUpdateUserMutation(userId: number) {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResponse, AxiosError<IErrorResponse>, UpdateUserData, unknown>({
    mutationFn: async (data: UpdateUserData) => {
      const response = await userRepository.updateUser(userId, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: UsersQueryKey("owner") });
    }
  });
}

export default useUpdateUserMutation;