import { ILocation } from "./location";

export interface ICourt {
  id: number;
  name: string;
  location_id: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  location?: ILocation;
  prices?: IPriceTable[];
}

export interface IPriceTable {
  id: number;
  court_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  price: number;
  court?: ICourt;
}
