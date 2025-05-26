import { IUser } from "@/stores/authStore";

export interface IPaymentMethod {
  id: number;
  account_name: string;
  payment_number: string;
  bank_code: string;
  bank_info: {
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
  };
  qr_image: string;
  owner_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner?: IUser;
}