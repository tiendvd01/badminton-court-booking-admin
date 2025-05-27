import httpService from "@/lib/httpService";

class CourtRepository {
  async createLocation(data: {
    name: string;
    address: string;
    description?: string;
    owner_id: number;
    min_shift_time: number;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/locations`, data);
  }

  async getLocations() {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/locations`);
  }

  async getLocation(id: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`);
  }

  async updateLocation(id: number, data: {
    name?: string;
    address?: string;
    description?: string;
    image_url?: string;
    owner_id?: string;
  }) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`, data);
  }

  async deleteLocation(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/locations/${id}`);
  }

  async addLocationImages(locationId: number, imageUrls: string[]) {
    return httpService.post(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}/images/add`, 
      { imageUrls },
    );
  }

  async getLocationImages(locationId: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}/images`);
  }

  async deleteLocationImage(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/locations/images/${id}`);
  }

  async createCourt(data: {
    name: string;
    location_id: number;
    description?: string;
    image_url?: string;
    is_active?: boolean;
  }) {
    return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/locations/courts`, data);
  }

  async getCourts(locationId?: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}/courts`);
  }

  async getCourt(id: number) {
    return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/courts/${id}`);
  }

  async updateCourt(id: number, data: {
    name?: string;
    location_id?: number;
    description?: string;
    is_active?: boolean;
    price_table_id?: number;
  }) {
    return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/locations/courts/${id}`, data);
  }

  async deleteCourt(id: number) {
    return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/locations/courts/${id}`);
  }
}

const courtRepository = new CourtRepository();
export default courtRepository;
