import { ConfigurationsType } from "./config";

export type MerchantDocument = {
  capped_usage: number;
  state: number;
  created_at: number;
  updated_at: number;
  owner: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  address: {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  installed: boolean;
  status: "DECLINED" | "ACTIVE" | "EXPIRED";
  usage: number;
  id: string;
  timezone: string;
  access_token: string;
  shop_name: string;
  shop_domain: string;
  myshopify_domain: string;
  apps: AppTypes[];
  free_trial: boolean;
  free_chats: number;
  configurations: ConfigurationsType;
};

export type AppTypes = {
  name: "gmail" | "outlook" | "stripe" | "recharge";
  token: string;
  connected: boolean;
  email: string;
};

export type LinkType = {
  name: string;
  url: string;
};

export type FAQType = {
  overview: string;
  faqs: { q: string; a: string }[];
};

export type FAQTypeNames =
  | "cancelation"
  | "products"
  | "subscriptions"
  | "discounts"
  | "giveaway";

export type ShopifyPolicies = {};
