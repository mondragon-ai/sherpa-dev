import { SERVER_BASE_URL } from "../constants";
import { ServicesReponseType, Status } from "../types/shared";

export const serverRequest = async (
  method: "POST" | "GET" | "PUT" | "DELETE",
  resource: string,
  payload: any | null,
): Promise<ServicesReponseType> => {
  const url = `${SERVER_BASE_URL}${resource}`;

  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);

  if (response.status == 204) {
    return {
      status: 204,
      data: null,
      message: "success",
    } as ServicesReponseType;
  }

  return {
    ...((await response.json()) as ServicesReponseType),
    status: response.status as Status,
  };
};
