interface CreateQuestionPostDto {
  ar_br: string;
  bi_di?: string;
  location?: string;
  woreda: string;
  last_digit: string;
  description: string;
  photo: string[];
  status: string;
  user_id: string;
}
export default CreateQuestionPostDto;
