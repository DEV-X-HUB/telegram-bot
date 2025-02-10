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

export interface PageQuery {
  page?: number;
  itemsPerPage?: number;
}

export interface PostQuery extends PageQuery {
  status?: PostStatus;
  category?: string;
}
export interface UserPostQuery extends PostQuery {
  userId: string;
}
export interface UserQuery extends PageQuery {
  status?: UserStatus;
}
