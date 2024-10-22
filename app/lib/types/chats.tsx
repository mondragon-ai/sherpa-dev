export type ChatDocument = {
  classification: string;
  email_to_send: string;
  email_sent: boolean;
  domain: string;
  id: string;
  conversation: Conversation[];
  time: number;
  issue: ChatIssue;
  status: "open" | "resolved";
  suggested_action: ChatSuggestedActions;
  customer: null | CustomerData;
  email: null | string;
  rating: "positive" | "negative" | "neutral";
  updated_at: number;
  created_at: number;
  summary: string;
  order: null | OrderData;
};

export type ChatIssue = "refund" | "status" | "address" | "exchange";

export type ChatSuggestedActions =
  | "resolve"
  | "refund"
  | "exchange"
  | "cancel_order"
  | "cancel_subscription";

export type CustomerData = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  tags: string;
  total_spent: number;
  total_orders: number;
  address: string;
};

export type Conversation = {
  time: number;
  is_note: boolean;
  message: string;
  sender: "agent" | "customer";
  action: null | "closed" | "opened";
};

export type OrderData = {
  id: string;
  total_price: string;
  fulfillment_status: "hold" | "shipped" | "delivered";
  payment_status: "hold" | "paid";
  tracking_url: string;
  order_number: number;
  created_at: number;
  line_items: LineItem[];
};

export type LineItem = {
  quantity: number;
  options: string;
  title: string;
};
