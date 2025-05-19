import httpService from '@/lib/httpService';
import { IPrice, IPriceTable } from '@/types/court';
class PriceRepository {
    // Price Table methods
    async createPriceTable(data: { description?: string; owner_id: number }): Promise<IPriceTable> {
        return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/price-tables`, data);
    }
    async getPriceTables(ownerId?: number): Promise<IPriceTable[]> {
        const url = ownerId
            ? `${process.env.NEXT_PUBLIC_API_URL}/price-tables?ownerId=${ownerId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/price-tables`;
        return httpService.get(url);
    }
    async getPriceTable(id: number): Promise<IPriceTable> {
        return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/${id}`);
    }
    async updatePriceTable(id: number, data: { description?: string; owner_id?: number }): Promise<IPriceTable> {
        return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/${id}`, data);
    }
    async deletePriceTable(id: number): Promise<{ message: string }> {
        return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/${id}`);
    }
    // Price methods
    async createPrice(data: {
        start_time: string;
        end_time: string;
        price: number;
        price_table_id: number;
    }): Promise<IPrice> {
        return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices`, data);
    }
    async getPrices(priceTableId?: number): Promise<IPrice[]> {
        const url = priceTableId
            ? `${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices?priceTableId=${priceTableId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices`;
        return httpService.get(url);
    }
    async getPrice(id: number): Promise<IPrice> {
        return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices/${id}`);
    }
    async updatePrice(
        id: number,
        data: { start_time?: string; end_time?: string; price?: number; price_table_id?: number },
    ): Promise<IPrice> {
        return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices/${id}`, data);
    }
    async deletePrice(id: number): Promise<{ message: string }> {
        return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices/${id}`);
    }
}
const priceRepository = new PriceRepository();
export default priceRepository;
