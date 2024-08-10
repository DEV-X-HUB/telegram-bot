"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
// nodemailer module is used to send emails
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailConfig = {
    host: config_1.default.email_host,
    port: config_1.default.email_port,
    secure: true,
    auth: {
        user: config_1.default.email,
        pass: config_1.default.email_password,
    },
};
const transporter = nodemailer_1.default.createTransport(mailConfig);
function sendEmail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            }
            else {
                console.log({ success });
            }
        });
        const info = yield transporter.sendMail({
            from: `"Do-not-reply" ${config_1.default.email}`,
            to,
            subject,
            html,
        });
        return info;
    });
}
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map