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
  description?: string;
  owner_id: number;
  prices?: IPrice[];
  courts?: ICourt[];
}

export interface IPrice {
  id: number;
  start_time: string;
  end_time: string;
  price: number;
  price_table_id: number;
  priceTable?: IPriceTable;
}
