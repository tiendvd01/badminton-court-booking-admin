import priceRepository from "@/repository/priceRepository";
import { useQuery } from "@tanstack/react-query";


interface GetPriceTablesByLocationParams {
    locationId: number;
    // Add other potential query parameters here if needed in the future
}

export const PriceTablesByLocationQueryKey = (params: GetPriceTablesByLocationParams) => ['price-tables-by-location', params];

export const usePriceTableByLocationQuery = ({
    locationId,
    enabled = true,
    ...params
}: { enabled?: boolean } & GetPriceTablesByLocationParams) => {
    return useQuery({
        queryKey: PriceTablesByLocationQueryKey({ locationId, ...params }),
        queryFn: () => priceRepository.getPriceTableByLocation(locationId),
        enabled: enabled && !!locationId,
    });
}
