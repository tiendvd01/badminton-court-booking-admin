'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userRepository from "@/repository/userRepository";
import { IUser } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";
import { UsersQueryKey } from "../auth/useUsersQuery";

interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

interface CreateCustomerResponse extends IResponse {
  data: IUser;
}

function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateCustomerResponse, AxiosError<IErrorResponse>, CreateCustomerData, unknown>({
    mutationFn: async (data: CreateCustomerData) => {
      const response = await userRepository.createCustomer(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: UsersQueryKey("customer") });
    }
  });
}

export default useCreateCustomerMutation;