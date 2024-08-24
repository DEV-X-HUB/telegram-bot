"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationValidator = void 0;
const registration_schema_1 = require("../../types/schemas/registration-schema");
const registrationValidator = (fieldName, value) => {
    let schema = null;
    switch (fieldName) {
        case 'first_name': {
            schema = registration_schema_1.firstNameSchema;
            break;
        }
        case 'last_name': {
            schema = registration_schema_1.lastNameSchema;
            break;
        }
        case 'age': {
            schema = registration_schema_1.ageOrDateSchema;
            break;
        }
        case 'email': {
            schema = registration_schema_1.emailSchema;
            break;
        }
    }
    try {
        if (!schema)
            return 'unknow field';
        schema.parse(value);
        return 'valid';
    }
    catch (error) {
        return error.errors[0].message;
    }
};
exports.registrationValidator = registrationValidator;
//# sourceMappingURL=registration-validator.js.map