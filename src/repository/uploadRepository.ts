import httpService from "@/lib/httpService";
import { IResponse } from "@/types/common";

interface UploadImageRes extends IResponse {
    data: {
        url: string;
    }
};

class UploadRepository {
    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        return httpService.post<UploadImageRes>(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

const uploadRepository = new UploadRepository();
export default uploadRepository;
