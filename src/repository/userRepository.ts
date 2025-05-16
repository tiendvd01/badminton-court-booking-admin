import httpService from "@/lib/httpService";

class UserRepository {
  async getUsers(role: string) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/users?role=${role}`);
  }

  async createOwner({
    name,
    email,
    phone,
    address,
    password,
  }: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password: string;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/users/createOwner`, {
      name,
      email,
      phone,
      address,
      password
    });
  }

  async createAdmin({
    name,
    email,
    phone,
    address,
    password,
  }: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password: string;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/users/createAdmin`, {
      name,
      email,
      phone,
      address,
      password
    });
  }

  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      avatar_url?: string;
    }
  ) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, data);
  }

  async deleteUser(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
  }
}

const userRepository = new UserRepository();
export default userRepository;
