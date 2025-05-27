
import { ICourt } from "./court";
import { IUser } from "@/stores/authStore";

export interface ILocation {
  id: number;
  name: string;
  address: string;
  description?: string;
  image_url?: string;
  owner_id: number;
  min_shift_time: number;
  created_at: string;
  updated_at: string;
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

