enum PostStatus {
  open = 'open',
  closed = 'close',
  pending = 'pending',
  rejected = 'rejected',
}

export interface CreatePostDto {
  description: string;
  category: string;
}

export interface CreatePostService1ADto {
  arbr_value: string;
  id_first_option: string;
  location: string;
  woreda: string;
  last_digit: string;
  photo: string[];

  description: string;
  status: PostStatus;
  category: string;
}

export interface CreatePostService4ManufactureDto {
  sector: string;
  number_of_workers: number;
  estimated_capital: string;
  enterprise_name: string;
  photo: string[];

  description: string;
  category: string;
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
}

export interface CreatePostService4ChickenFarmDto {
  sector: string;
  estimated_capital: string;
  enterprise_name: string;

  description: string;
  category: string;
}
