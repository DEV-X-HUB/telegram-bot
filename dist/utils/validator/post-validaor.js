"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidator = void 0;
const post_schema_1 = require("../../types/schemas/post-schema");
const postValidator = (fieldName, value) => {
    let schema = null;
    switch (fieldName) {
        case 'issue_date': {
            schema = post_schema_1.IssueDateSchema;
            break;
        }
        case 'expire_date': {
            schema = post_schema_1.ExpireDateSchema;
            break;
        }
        case 'last_digit': {
            schema = post_schema_1.lastDititSchema;
            break;
        }
        case 'title': {
            schema = post_schema_1.titleSchema;
            break;
        }
        case 'description': {
            schema = post_schema_1.descriptionSchema;
            break;
        }
        case 'location':
            schema = post_schema_1.locationSchema;
            break;
        case 'confirmation_year':
            schema = post_schema_1.ConfirmationYearSchema;
            break;
    }
    try {
        // if (!schema) return 'No schema found';
        if (!schema)
            return true;
        schema.parse(value);
        return 'valid';
    }
    catch (error) {
        return error.errors[0].message;
    }
};
exports.postValidator = postValidator;
//# sourceMappingURL=post-validaor.js.map