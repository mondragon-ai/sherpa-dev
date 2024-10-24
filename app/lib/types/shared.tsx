export type Status =
  | 500
  | 422
  | 403
  | 409
  | 401
  | 400
  | 404
  | 422
  | 200
  | 201
  | 203
  | 204;

export type ServicesReponseType = {
  status: Status;
  data: any;
  message: string;
};
