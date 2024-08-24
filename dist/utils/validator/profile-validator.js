"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidator = void 0;
const registration_schema_1 = require("../../types/schemas/registration-schema");
const profileValidator = (fieldName, value) => {
    let schema = null;
    switch (fieldName) {
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
            return 'valid';
        schema.parse(value);
        return 'valid';
    }
    catch (error) {
        return error.errors[0].message;
    }
};
exports.profileValidator = profileValidator;
//# sourceMappingURL=profile-validator.js.map