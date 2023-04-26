export interface IResponse {
  latency: number;
  response_status: number | null;
}

export interface IResponseComplete extends IResponse {
  created_at: string;
  id: number;
  urlId: number;
}
