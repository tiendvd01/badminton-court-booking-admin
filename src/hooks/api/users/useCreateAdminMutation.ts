'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userRepository from "@/repository/userRepository";
import { IUser } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { UsersQueryKey } from "../auth/useUsersQuery";

interface CreateAdminData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

interface CreateAdminResponse extends IResponse {
  data: IUser;
}

function useCreateAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateAdminResponse, AxiosError<IErrorResponse>, CreateAdminData, unknown>({
    mutationFn: async (data: CreateAdminData) => {
      const response = await userRepository.createAdmin(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: UsersQueryKey("admin") });
    }
  });
}

export default useCreateAdminMutation;