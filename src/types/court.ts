import { ILocation } from "./location";

export interface ICourt {
  id: number;
  name: string;
  location_id: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  location?: ILocation;
  price_table_id: number;
  priceTable?: IPriceTable;
}

export interface IPriceTable {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  owner?: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
  };
  prices: IPrice[];
  created_at?: string;
  updated_at?: string;
}

export interface IPrice {
  start_time: string;
  end_time: string;
  price: number;
}
