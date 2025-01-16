"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateOTP(digits = 5) {
    // Generate a random otp of specified length
    const otp = Math.random().toString().slice(-digits);
    return otp;
}
exports.default = generateOTP;
//# sourceMappingURL=generatePassword.js.map