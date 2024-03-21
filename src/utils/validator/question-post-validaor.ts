import { DescriptionSchema, lastDititSchema } from '../../types/schemas/question-post-schema';

type RegistrationValue = string | number | Date;

export const questionPostValidator = (fieldName: string, value: RegistrationValue) => {
  let schema = null;
  switch (fieldName) {
    case 'last_digit': {
      schema = lastDititSchema;
      break;
    }
    case 'description': {
      schema = DescriptionSchema;
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
