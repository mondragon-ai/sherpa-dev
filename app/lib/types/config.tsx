export type ConfigurationsType = {
  cancelation: FAQType;
  products: FAQType;
  subscriptions: FAQType;
  discounts: FAQType;
  giveaway: FAQType;
  special_cases: { title: string; description: string }[];
  exception: string;
  shipping: string;
  store: string;
  contact_email: string;
  return: number;
  exchanges: boolean;
  refund: boolean;
  damged_items: boolean;
  automate_actions: boolean;
  automate_emails: boolean;
  price_rules: {
    id: number;
    title: string;
    value: string;
    value_type: "percentage" | "fixed";
  };
  tone: "standard" | "playful" | "custom";
  custom_tone: string;
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
