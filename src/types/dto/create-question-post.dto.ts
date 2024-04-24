import { NotifyOption } from '../params';

enum PostStatus {
  open = 'open',
  closed = 'close',
  pending = 'pending',
  rejected = 'rejected',
}

export interface CreatePostDto {
  description: string;
  category: string;
  notify_option: NotifyOption;
  previous_post_id?: string;
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
  previous_post_id?: string;
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
  previous_post_id?: string;
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
  previous_post_id?: string;
}

export interface CreatePostService4ManufactureDto {
  sector: string;
  number_of_workers: number;
  estimated_capital: string;
  enterprise_name: string;
  photo: string[];

  description: string;
  category: string;
  notify_option: NotifyOption;
  previous_post_id?: string;
}

export interface CreatePostService4ConstructionDto {
  construction_size?: string;
  company_experience?: string;
  document_request_type?: string;
  land_size?: string;
  land_status?: string;
  location: string;
  photo: string[];

  description: string;
  category: string;
  notify_option: NotifyOption;
  previous_post_id?: string;
}

export interface CreatePostService4ChickenFarmDto {
  sector: string;
  estimated_capital: string;
  enterprise_name: string;

  description: string;
  category: string;
  notify_option: NotifyOption;
  previous_post_id?: string;
}
export interface CreatePostService2Dto {
  service_type: string;
  title: string;
  photo: string[];

  description: string;
  category: string;
  notify_option: NotifyOption;
  previous_post_id?: string;
}

export type CreateCategoryPostDto =
  | CreatePostService1BDto
  | CreatePostService1ADto
  | CreatePostService1CDto
  | CreatePostService4ChickenFarmDto
  | CreatePostService4ManufactureDto
  | CreatePostService4ConstructionDto
  | CreatePostService2Dto;
