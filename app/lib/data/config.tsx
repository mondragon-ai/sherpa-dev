import { ConfigurationsType } from "../types/config";

export const config_state: ConfigurationsType = {
  cancelation: {
    overview: "",
    faqs: [],
  },
  products: {
    overview: "",
    faqs: [],
  },
  subscriptions: {
    overview: "",
    faqs: [],
  },
  discounts: {
    overview: "",
    faqs: [],
  },
  giveaway: {
    overview: "",
    faqs: [],
  },
  special_cases: [],
  exception: "",
  shipping: "",
  store: "",
  contact_email: "",
  return: 0,
  exchanges: false,
  refund: false,
  damged_items: false,
  automate_actions: false,
  automate_emails: false,
  price_rules: {
    id: "",
    title: "",
    value: "",
    value_type: "percentage",
  },
  tone: "custom",
  custom_tone: "",
  links: [],
  email_signature: {
    logo: "",
    facebook: "",
    twitter: "",
    tiktok: "",
    youtube: "",
    instagram: "",
    name: "",
    company: "",
  },
};
