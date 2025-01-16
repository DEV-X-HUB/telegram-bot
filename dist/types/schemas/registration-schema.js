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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = exports.ageOrDateSchema = exports.lastNameSchema = exports.firstNameSchema = void 0;
const zod_1 = __importStar(require("zod"));
const config_1 = __importDefault(require("../../config/config"));
zod_1.default.coerce.string().email().min(5);
exports.firstNameSchema = zod_1.default
    .string()
    .regex(/(^[\u1200-\u137F\s]+$)|(^[a-zA-Z]+$)/, { message: 'First name must contain only letters' })
    .min(2, { message: 'First name must be at least 3 characters long' })
    .max(15, { message: 'First name must be at most 15 characters long' });
exports.lastNameSchema = zod_1.default
    .string()
    .regex(/(^[\u1200-\u137F\s]+$)|(^[a-zA-Z]+$)/, { message: 'First name must contain only letters' })
    .min(2, { message: 'First name must be at least 3 characters long' })
    .max(15, { message: 'First name must be at most 15 characters long' });
exports.ageOrDateSchema = zod_1.default.string().refine((value) => {
    // Check if the value is a number (age)
    const number = Number(value);
    if (!isNaN(number)) {
        if (!/^\d+$/.test(value)) {
            throw new zod_1.ZodError([
                {
                    code: 'custom',
                    message: 'age must be a valid integer or date value.',
                    path: [],
                },
            ]);
        }
        return number >= 14 && number <= 100;
    }
    // Check if the value is a date(dd/mm/yyyy)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dateRegex.test(value)) {
        const [day, month, year] = value.split('/');
        const dayNumber = parseInt(day);
        const monthNumber = parseInt(month);
        const yearNumber = parseInt(year);
        if (dayNumber < 1 ||
            dayNumber > 31 ||
            monthNumber < 1 ||
            monthNumber > 12 ||
            year.length !== 4 ||
            yearNumber > new Date().getFullYear()) {
            return false;
        }
        // Calculate age from the entered date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let age = currentYear - yearNumber;
        if (parseInt(month) <= config_1.default.monthThreshold) {
            age--;
        }
        // Check if the calculated age is between 14 and 100
        return age >= 14 && age <= 100;
    }
    // If it's not a date or a number, return false
    return false;
}, {
    message: 'Invalid input. Please enter a valid age (14-100) or a valid date (dd/mm/yyyy).',
});
exports.emailSchema = zod_1.default.string().refine((value) => {
    // Check if the email is valid
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9]*@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
}, {
    message: 'Invalid email address. Please enter a valid email.',
});
//# sourceMappingURL=registration-schema.js.map