'use client'
import { useMutation } from "@tanstack/react-query";
import userRepository from "@/repository/userRepository";
import { IErrorResponse } from "@/types/common";
import { AxiosError } from "axios";

function useDeleteUserMutation() {

  return useMutation<any, AxiosError<IErrorResponse>, number, unknown>({
    mutationFn: async (userId: number) => {
      const response = await userRepository.deleteUser(userId);
      return response.data;
    },
  });
}

export default useDeleteUserMutation;