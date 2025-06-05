
import { ICourt } from "./court";
import { IUser } from "@/stores/authStore";

export interface ILocation {
  id: number;
  name: string;
  address: string;
  description?: string;
  logo?: string;
  owner_id: number;
  min_shift_time: number;
  created_at: string;
  updated_at: string;
  images?: ILocationImage[];
  owner?: IUser;
  courts?: ICourt[];
}

export interface ILocationImage {
  id: number;
  location_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

