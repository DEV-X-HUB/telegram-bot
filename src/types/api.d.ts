import { Request, Response, NextFunction } from 'express';
interface BareResponse {
  status: 'success' | 'fail';
  message: string;
}
interface ResponseWithData extends BareResponse {
  data: null | any;
}
export type PostStatus = 'pending' | 'open' | 'closed';

export interface JwtAuthPayload {
  id: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: any;
}
