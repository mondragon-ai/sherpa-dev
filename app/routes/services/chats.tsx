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
 * Resolve the Chat (close & autocomeplete).
 * @param {FetcherWithComponents} fetcher - The fetcher to submit the request.
 * @param {string} id - Chat ID
 */
export const resolveChat = async (
  fetcher: FetcherWithComponents<ActionFetcherType>,
  id: string,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("action", "resolve");
    formData.append("id", id);
    fetcher.submit(formData, { method: "POST" });
  } catch (error) {
    console.error("Error deleting chats:", error);
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
