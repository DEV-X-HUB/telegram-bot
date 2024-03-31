import { DescriptionSchema, IssueDateSchema, lastDititSchema } from '../../types/schemas/question-post-schema';

type RegistrationValue = string | number | Date;

export const questionPostValidator = (fieldName: string, value: RegistrationValue) => {
  let schema = null;
  switch (fieldName) {
    case 'issue_date': {
      schema = IssueDateSchema;
      break;
    }
    case 'last_digit': {
      schema = lastDititSchema;
      break;
    }
    case 'description': {
      schema = DescriptionSchema;
      break;
    }
    case 'location':
      schema = DescriptionSchema;
      break;
    case 'photo':
      schema = Array;
      break;
  }

  try {
    if (!schema) return 'No schema found';
    // schema.parse(value);
    return 'valid';
  } catch (error: any) {
    return error.errors[0].message;
  }
};
