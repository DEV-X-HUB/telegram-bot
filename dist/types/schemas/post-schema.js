"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationSchema = exports.DateSchema = exports.ExpireDateSchema = exports.IssueDateSchema = exports.ConfirmationYearSchema = exports.lastDititSchema = exports.titleSchema = exports.descriptionSchema = exports.TextSchema = void 0;
const zod_1 = __importStar(require("zod"));
const string_1 = require("../../utils/helpers/string");
const locationMaxLetters = 20;
const descriptionWordLength = 45;
const titleWordLength = 5;
const TextSchema = ({ wordLength = 15, textName }) => zod_1.default.string().refine((value) => {
    const { isValid, errorMessage } = (0, string_1.validateString)({ value, textName, wordLength });
    if (!isValid)
        throw new zod_1.ZodError([
            {
                code: 'too_small',
                minimum: 4,
                type: 'string',
                inclusive: true,
                exact: false,
                message: errorMessage ||
                    `${textName} must not exceed ${wordLength} words and ${wordLength * 15} characters and each word should not exceed ${wordLength} characters`,
                path: [],
            },
        ]);
    return isValid;
});
exports.TextSchema = TextSchema;
exports.descriptionSchema = (0, exports.TextSchema)({ textName: 'Description', wordLength: descriptionWordLength });
exports.titleSchema = (0, exports.TextSchema)({ textName: 'Title', wordLength: titleWordLength });
exports.lastDititSchema = zod_1.default.string().refine((value) => {
    // Check if the input is a valid integer
    if (!/^\d+$/.test(value)) {
        throw new zod_1.ZodError([
            {
                code: 'custom',
                message: 'The input must be a valid integer.',
                path: [],
            },
        ]);
    }
    // Check if the input is not only "0"
    if (value === '0') {
        throw new zod_1.ZodError([
            {
                code: 'custom',
                message: 'The input cannot be only zero.',
                path: [],
            },
        ]);
    }
    // Check if the input does not begin with "0"
    if (value[0] === '0') {
        throw new zod_1.ZodError([
            {
                code: 'custom',
                message: 'The input must not begin with zero.',
                path: [],
            },
        ]);
    }
    // Ensure the last character of the string is a digit (it will be by default if the above checks pass)
    const lastChar = value[value.length - 1];
    if (!/\d/.test(lastChar)) {
        throw new zod_1.ZodError([
            {
                code: 'custom',
                message: 'The last digit must be a number.',
                path: [],
            },
        ]);
    }
    return true; // All checks passed
}, {
    message: 'Invalid input.', // General error message
});
exports.ConfirmationYearSchema = zod_1.default
    .string()
    .length(4, 'confirmation year must be four digit number')
    .refine((value) => {
    const number = Number(value);
    if (isNaN(number)) {
        // Invalid format (not a date or a number)
        throw new zod_1.ZodError([
            {
                code: 'too_small',
                minimum: 4,
                type: 'string',
                inclusive: true,
                exact: false,
                message: 'confirmation year must be four digit number',
                path: [],
            },
        ]);
    }
    else if (number < 1970) {
        // Invalid format (not a date or a number)
        throw new zod_1.ZodError([
            {
                code: 'too_small',
                minimum: 4,
                type: 'string',
                inclusive: true,
                exact: false,
                message: 'confirmation year must be greater than 1970',
                path: [],
            },
        ]);
    }
    else {
        return true; // Valid number within range
    }
}, { message: 'confirmation year must be four digit number' });
exports.IssueDateSchema = zod_1.default
    .string()
    .regex(/^(0?[1-9]|1[0-2])\/\d{4}$/)
    .refine((value) => {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (parseInt(year) > currentYear) {
        return false;
    }
    if (parseInt(year) === currentYear && parseInt(month) > currentMonth) {
        return false;
    }
    // check if the year gap isnot more than 100 years
    if (currentYear - parseInt(year) > 100) {
        return false;
    }
    return true;
});
exports.ExpireDateSchema = zod_1.default
    .string()
    .regex(/^(0?[1-9]|1[0-2])\/\d{4}$/)
    .refine((value) => {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (parseInt(year) < currentYear) {
        return false;
    }
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
        return false;
    }
    // check if the year gap isnot more than 100 years
    if (parseInt(year) - currentYear > 100) {
        return false;
    }
    return true;
});
exports.DateSchema = zod_1.default
    .string()
    .regex(/^\d{2}\/\d{1,2}\/\d{4}$/)
    .refine((value) => {
    const [day, month, year] = value.split('/');
    const isValidDate = !isNaN(Date.parse(`${year}-${month}-${day}`));
    return isValidDate;
}, {
    message: 'Invalid date format ',
});
exports.locationSchema = zod_1.default.string().refine((value) => {
    const lettersCount = value.replace(/[^a-zA-Z]/g, '').length;
    const hasSpecialCharacters = /[^\w\s]/.test(value);
    return lettersCount <= locationMaxLetters && !hasSpecialCharacters;
}, {
    message: `location must not exceed ${locationMaxLetters} letters and should not contain any special characters or emoji`,
});
//# sourceMappingURL=post-schema.js.map