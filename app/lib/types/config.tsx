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
    id: string;
    title: string;
    value: string;
    value_type: "percentage" | "fixed";
  };
  tone: "standard" | "playful" | "custom";
  custom_tone: string;
  links: LinkType[] | [];
  email_signature: EmailSignature;
};

export type EmailSignature = {
  logo: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  instagram: string;
  name: string;
  company: string;
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
