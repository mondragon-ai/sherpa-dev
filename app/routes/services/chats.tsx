import { FetcherWithComponents } from "@remix-run/react";
import { ActionFetcherType } from "app/lib/types/shared";

/**
 * Handles the Chat deletion.
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Chat ID
 */
export const deleteChat = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  id: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", id);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting chats:", error);
  }
};

/**
 * Resolve the Chat (close &/or autocomeplete).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param { { email: string; type: "email" | "chat" }} payload - ID & type
 */
export const resolveChat = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  payload: { email: string; type: "email" | "chat" },
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "resolve");
    formData.append("payload", JSON.stringify(payload));
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error resolving chat:", error);
  }
};

/**
 * Resolve the Chat (close & autocomeplete).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Chat ID
 * @param {string} note - Chat note
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
    console.error("Error deleting chats:", error);
  }
};

/**
 * Fetch the filtered Chats
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {"newest" | "open" | "action_required"} query - Filter Type
 */
export const filterChat = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  query: "newest" | "open" | "action_required",
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "filter");
    formData.append("query", query);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting chats:", error);
  }
};

/**
 * Handles the Chat request (from algolia).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Chat ID
 */
export const fetchChat = async (
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
 * Handles the next list of chats (infinity scroll)
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} time - Chat ID
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
