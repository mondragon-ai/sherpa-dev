import {
  SuggestedActions,
  Conversation,
  CustomerData,
  IssueTypes,
  RatingTypes,
  ClassificationTypes,
  OrderData,
  EmailConversation,
} from "./shared";

export type EmailDocument = {
  specific_issue: string;
  edited: boolean;
  suggested_email: string;
  email_sent: boolean;
  manual: boolean;
  manually_triggerd: boolean;
  initial_message: string;
  convo_trained: boolean;
  action_trained: boolean;

  // chat
  rating: RatingTypes | null;
  classification: ClassificationTypes | null;
  issue: IssueTypes | null;
  suggested_action_done: boolean;
  summary: string;
  error_info: string;
  timezone: string;
  domain: string;
  id: string;
  conversation: EmailConversation[];
  time: number;
  status: "open" | "resolved" | "action_required";
  suggested_action: SuggestedActions | null;
  customer: null | CustomerData;
  email: null | string;
  updated_at: number;
  created_at: number;
  order: null | OrderData;
  source: "gmail" | "outlook";
  history_id: string;
  sentiment: RatingTypes;
};

export type EmailMessage = {
  id: string;
  threadId: string;
  internalDate: string;
  sender: "agent" | "customer";
  from: string;
  to: string;
  subject: string;
  message: string;
  image: any[];
};
