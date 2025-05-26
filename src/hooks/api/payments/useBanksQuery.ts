import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
}

interface BanksResponse {
  code: string;
  desc: string;
  data: Bank[];
}

export const BanksQueryKey = ['banks'];

export default function useBanksQuery() {
  return useQuery<Bank[]>({
    queryKey: BanksQueryKey,
    queryFn: async () => {
      try {
        const response = await axios.get<BanksResponse>('https://api.vietqr.io/v2/banks');
        
        if (response.data.code !== '00') {
          throw new Error(response.data.desc || 'Failed to fetch banks');
        }
        
        // Sort banks by name for better UX
        return response.data.data.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error('Error fetching banks:', error);
        throw error;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - banks don't change often
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}