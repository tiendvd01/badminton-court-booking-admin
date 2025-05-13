import httpService from "@/lib/httpService";

class AuthRepository {
  async login(email: string, password: string) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      email,
      password,
    });
  }

  async register({
    name,
    email,
    password,
    phone,
    avatar_url,
  }: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatar_url?: string;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
      name,
      email,
      password,
      phone,
      avatar_url,
    });
  }

  async getProfile() {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`);
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
  }) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/edit`, data);
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/users/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
const authRepository = new AuthRepository();
export default authRepository;
