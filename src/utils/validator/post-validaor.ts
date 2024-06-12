import { ExpireDateSchema, IssueDateSchema, locationSchema, titleSchema } from '../../types/schemas/post-schema';
import DateSchema, {
  DescriptionSchema,
  ConfirmationYearSchema,
  lastDititSchema,
} from '../../types/schemas/post-schema';

type RegistrationValue = string | number | Date;

export const postValidator = (fieldName: string, value: RegistrationValue) => {
  let schema = null;
  switch (fieldName) {
    case 'issue_date': {
      schema = IssueDateSchema;
      break;
    }

    case 'expire_date': {
      schema = ExpireDateSchema;
      break;
    }
    case 'last_digit': {
      schema = lastDititSchema;
      break;
    }
    case 'title': {
      schema = titleSchema;
      break;
    }
    case 'description': {
      schema = DescriptionSchema;
      break;
    }
    case 'location':
      schema = locationSchema;
      break;
    case 'confirmation_year':
      schema = ConfirmationYearSchema;
      break;
      // case 'photo':
      //   schema = Array;
      break;
  }

  try {
    // if (!schema) return 'No schema found';
    if (!schema) return true;
    schema.parse(value);

    return 'valid';
  } catch (error: any) {
    return error.errors[0].message;
  }
};
