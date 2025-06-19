import { Request } from 'express';
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

export type PostSortField = 'created_at' | 'arbr_value' | 'last_digit' | 'user_first_name' | 'category';
export interface PostQuery extends PageQuery {
  status?: PostStatus;
  category?: string;
  sortField?: PostSortField;
  sortOrder?: 'asc' | 'desc';
}

export interface PageQuery {
  page?: number;
  itemsPerPage?: number;
}
export interface UserPostQuery extends PostQuery {
  userId: string;
}
export interface UserQuery extends PageQuery {
  status?: UserStatus;
  queryString?: string;
}

declare module 'nodemailer';
