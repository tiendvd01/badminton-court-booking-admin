import httpService from '@/lib/httpService';
class PriceRepository {
    // Price Table methods
    async createPriceTable(data: { description?: string; owner_id: number }) {
        return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/price-tables`, data);
    }
    async getPriceTables(ownerId?: number) {
        const url = ownerId
            ? `${process.env.NEXT_PUBLIC_API_URL}/price-tables?ownerId=${ownerId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/price-tables`;
        return httpService.get(url);
    }
    async getPriceTable(id?: number) {
        return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/${id}`);
    }
    async updatePriceTable(id: number, data: { description?: string; owner_id?: number }) {
        return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/${id}`, data);
    }
    async getPriceTableByLocation(locationId: number) {
        return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/byLocation?locationId=${locationId}`);
    }
    async deletePriceTable(id: number) {
        return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/${id}`);
    }
    // Price methods
    async createPrice(data: { start_time: string; end_time: string; price: number; price_table_id: number }) {
        return httpService.post(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices`, data);
    }
    async getPrices(priceTableId?: number) {
        const url = priceTableId
            ? `${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices?priceTableId=${priceTableId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices`;
        return httpService.get(url);
    }
    async getPrice(id: number) {
        return httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices/${id}`);
    }
    async updatePrice(
        id: number,
        data: { start_time?: string; end_time?: string; price?: number; price_table_id?: number },
    ) {
        return httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices/${id}`, data);
    }
    async deletePrice(id: number) {
        return httpService.delete(`${process.env.NEXT_PUBLIC_API_URL}/price-tables/prices/${id}`);
    }
}
const priceRepository = new PriceRepository();
export default priceRepository;
