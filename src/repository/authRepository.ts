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
}
const authRepository = new AuthRepository();
export default authRepository;
