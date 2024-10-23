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
    id: 0,
    title: "",
    value: "",
    value_type: "percentage",
  },
  tone: "custom",
  custom_tone: "be funny",
};
