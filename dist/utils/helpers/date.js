"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateString = exports.formatDateFromIsoString = exports.calculateAge = void 0;
const config_1 = __importDefault(require("../../config/config"));
const calculateAge = (ageValue) => {
    if (ageValue.includes('/')) {
        const [day, month, year] = ageValue.split('/').map(Number);
        const today = new Date();
        const birthDate = new Date(year, month - 1, day);
        let age = today.getFullYear() - birthDate.getFullYear();
        if (month <= config_1.default.monthThreshold) {
            age--;
        }
        return age;
    }
    else
        return parseInt(ageValue);
};
exports.calculateAge = calculateAge;
function formatDateFromIsoString(dateString) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
    const diffInMilliseconds = currentDate.getTime() - inputDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
        return 'today';
    }
    else if (diffInDays === 1) {
        return 'yesterday';
    }
    else if (inputDate.getFullYear() === currentDate.getFullYear() && inputDate.getMonth() === currentDate.getMonth()) {
        return `${diffInDays} days ago`;
    }
    else {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }).format(inputDate);
        return formattedDate;
    }
}
exports.formatDateFromIsoString = formatDateFromIsoString;
const parseDateString = (dateString) => {
    // Split the date string by '/'
    let date;
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    // Create a new Date object with extracted day, month, and year
    if (year)
        date = new Date(year, month - 1, day);
    date = new Date(month, day - 1, 1);
    return date;
};
exports.parseDateString = parseDateString;
//# sourceMappingURL=date.js.map