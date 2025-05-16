'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userRepository from "@/repository/userRepository";
import { IUser } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { UsersQueryKey } from "../auth/useUsersQuery";

interface CreateOwnerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

interface CreateOwnerResponse extends IResponse {
  data: IUser;
}

function useCreateOwnerMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateOwnerResponse, AxiosError<IErrorResponse>, CreateOwnerData, unknown>({
    mutationFn: async (data: CreateOwnerData) => {
      const response = await userRepository.createOwner(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: UsersQueryKey("owner") });
    }
  });
}

export default useCreateOwnerMutation;