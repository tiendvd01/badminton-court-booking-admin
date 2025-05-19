import httpService from "@/lib/httpService";

class CourtRepository {
  async createLocation(data: {
    name: string;
    address: string;
    description?: string;
    image_url?: string;
    owner_id: number;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations`, data);
  }

  async getLocations() {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations`);
  }

  async getLocation(id: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations/${id}`);
  }

  async updateLocation(id: number, data: {
    name?: string;
    address?: string;
    description?: string;
    image_url?: string;
    owner_id?: number;
  }) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations/${id}`, data);
  }

  async deleteLocation(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations/${id}`);
  }

  async addLocationImages(locationId: number, imageUrls: string[]) {
    return httpService.post(
      `${process.env.NEXT_PUBLIC_API_URL}/courts/locations/${locationId}/images/add`, 
      imageUrls,
    );
  }

  async getLocationImages(locationId: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations/${locationId}/images`);
  }

  async deleteLocationImage(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/courts/locations/images/${id}`);
  }

  async createCourt(data: {
    name: string;
    location_id: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/courts`, data);
  }

  async getCourts(locationId?: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/courts?locationId=${locationId}`);
  }

  async getCourt(id: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/courts/${id}`);
  }

  async updateCourt(id: number, data: {
    name?: string;
    location_id?: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
  }) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/courts/${id}`, data);
  }

  async deleteCourt(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/courts/${id}`);
  }
}

const courtRepository = new CourtRepository();
export default courtRepository;
