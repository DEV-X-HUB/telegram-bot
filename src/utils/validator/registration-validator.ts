import { ageOrDateSchema, emailSchema, firstNameSchema, lastNameSchema } from '../../types/schemas/registration-schema';

type RegistrationValue = string | number | Date;

export const registrationValidator = (fieldName: string, value: RegistrationValue) => {
  let schema = null;
  switch (fieldName) {
    case 'first_name': {
      schema = firstNameSchema;
      break;
    }
    case 'last_name': {
      schema = lastNameSchema;
      break;
    }
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
    if (!schema) return 'unknow field';
    schema.parse(value);
    return 'valid';
  } catch (error: any) {
    return error.errors[0].message;
  }
};
