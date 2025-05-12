'use client'
import { useMutation } from "@tanstack/react-query";
import authRepository from "@/repository/authRepository";
import { IUser, useAuthStore } from "@/stores/authStore";
import { IErrorResponse, IResponse } from "@/types/common";
import { AxiosError } from "axios";

interface LoginResponse extends IResponse {
  data: {
    user: IUser;
    token: string;
  };
}

function useLoginMutation() {
  const { login } = useAuthStore();

  return useMutation<LoginResponse, AxiosError<IErrorResponse>, { email: string; password: string }, unknown>({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authRepository.login(email, password);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
    }
  });
}

export default useLoginMutation;
