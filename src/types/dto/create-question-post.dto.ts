import { NotifyOption } from '../params';

enum PostStatus {
  open = 'open',
  closed = 'close',
  pending = 'pending',
  rejected = 'rejected',
}

export interface CreatePostService1ADto {
  arbr_value: string;
  id_first_option: string;
  location: string;
  woreda: string;
  last_digit: string;
  photo: string[];

  description: string;
  category: string;
  notify_option: NotifyOption;
}
export interface CreatePostService1BDto {
  title: string;
  main_category: string;
  sub_category: string;
  condition: string;
  id_first_option: string;
  location: string;
  woreda: string;
  last_digit: string;
  photo: string[];
  issue_date?: Date;
  expire_date?: Date;

  description: string;
  category: string;
  notify_option: NotifyOption;
}

export interface CreatePostService1CDto {
  arbr_value: string;
  id_first_option: string;
  paper_stamp: string;
  woreda: string;
  last_digit: string;
  service_type_1: string;
  service_type_2: string;
  service_type_3: string;
  confirmation_year: string;
  photo: string[];

  description: string;
  category: string;
  notify_option: NotifyOption;
}

export interface CreatePostDto {
  description: string;
  category: string;
  notify_option: NotifyOption;
}

export type CreateCategoryPostDto = CreatePostService1BDto | CreatePostService1ADto | CreatePostService1CDto;
