'use client'
import { useQuery } from "@tanstack/react-query";
import userRepository from "@/repository/userRepository";
import { IUser } from "@/stores/authStore";
import { IResponse } from "@/types/common";

interface UsersResponse extends IResponse {
  data: IUser[];
}

export const UsersQueryKey = (role: string) => ["users", role];

function useUsersQuery({ role, enabled = true }: { role: "admin" | "owner" | "customer", enabled?: boolean }) {
  return useQuery<UsersResponse>({
    queryKey: UsersQueryKey(role),
    queryFn: async () => {
      const response = await userRepository.getUsers(role);
      return response.data;
    },
    enabled,
  });
}

export default useUsersQuery;
