'use client'
import { useMutation } from "@tanstack/react-query";
import authRepository from "@/repository/authRepository";
import { useAuthStore } from "@/stores/authStore";

function useLoginMutation() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authRepository.login(email, password);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
    }
  });
}

export default useLoginMutation;
