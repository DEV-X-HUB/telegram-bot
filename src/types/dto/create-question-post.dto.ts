export interface CreateQuestionPostDto {
  ar_br: string;
  bi_di: string;
  location: string;
  woreda: string;
  last_digit: string;
  description: string;
  photo: string[];
  status: string;
  category: string;
  user_id: string;
}

export interface CreatePostDto {
  description: string;
  category: string;
  user_id: string;
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
