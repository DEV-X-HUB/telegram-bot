import { ageOrDateSchema, emailSchema, firstNameSchema, lastNameSchema } from '../../types/schemas/registration-schema';

type RegistrationValue = string | number | Date;

export const profileValidator = (fieldName: string, value: RegistrationValue) => {
  let schema = null;
  switch (fieldName) {
    case 'age': {
      schema = ageOrDateSchema;
      break;
    }
    case 'email': {
      schema = emailSchema;
      break;
    }
  }

  try {
    if (!schema) return 'valid';
    schema.parse(value);
    return 'valid';
  } catch (error: any) {
    return error.errors[0].message;
  }
};
