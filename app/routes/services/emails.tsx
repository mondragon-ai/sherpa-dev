import { FetcherWithComponents } from "@remix-run/react";
import { ActionFetcherType } from "app/lib/types/shared";

/**
 * Handles the email deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Email ID
 */
export const deleteEmail = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  id: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", id);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting Email:", error);
  }
};

/**
 * Resolve the Email (close &/or autocomeplete).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param { { email: string; type: "email" | "chat" }} payload - ID & type
 */
export const resolveEmail = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  payload: { email: string; type: "email" | "chat" },
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "resolve");
    formData.append("payload", JSON.stringify(payload));
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error resolving email:", error);
  }
};

/**
 * Resolve the Email (close & autocomeplete).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Email ID
 * @param {string} note - Email note
 */
export const submitNote = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  id: string,
  note: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "note");
    formData.append("note", JSON.stringify({ id, note }));
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting Emails:", error);
  }
};

/**
 * Fetch the filtered Emails
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {"newest" | "open" | "action_required"} query - Filter Type
 */
export const filterEmail = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  query: "newest" | "open" | "action_required",
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "filter");
    formData.append("query", query);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting Emails:", error);
  }
};

/**
 * Handles the Email request (from algolia).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Chat ID
 */
export const fetchEmail = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  id: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "request");
    formData.append("id", id);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error request chat:", error);
  }
};

/**
 * Handles the next list of emails (infinity scroll)
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} time - email time
 */
export const fetchNext = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  time: number,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "next");
    formData.append("time", `${time}`);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error request next chat list:", error);
  }
};

/**
 * Send email to chat
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {{ to: string; subject: string; email: string }} payload - Chat ID
 */
export const sendEmail = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  payload: { to: string; subject: string; email: string },
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "send_email");
    formData.append("payload", JSON.stringify(payload));
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
