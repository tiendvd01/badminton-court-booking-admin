import { useMutation } from "@tanstack/react-query";
import uploadRepository from "@/repository/uploadRepository";

export default function useUploadImageMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadRepository.uploadImage(file);
      return response.data;
    },
  });
}