import {
  ExpireDateSchema,
  IssueDateSchema,
  locationSchema,
  titleSchema,
  descriptionSchema,
  ConfirmationYearSchema,
  lastDititSchema,
} from '../../types/schemas/post-schema';

type RegistrationValue = string | number | Date;

type ValidationFiled =
  | 'issue_date'
  | 'expire_date'
  | 'last_digit'
  | 'title'
  | 'description'
  | 'location'
  | 'confirmation_year';

export const postValidator = (fieldName: ValidationFiled, value: RegistrationValue) => {
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
      schema = descriptionSchema;
      break;
    }
    case 'location':
      schema = locationSchema;
      break;
    case 'confirmation_year':
      schema = ConfirmationYearSchema;
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
