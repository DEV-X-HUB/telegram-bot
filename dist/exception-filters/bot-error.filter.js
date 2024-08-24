"use strict";
// Global Error Handler - geh
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_logger_1 = __importDefault(require("../utils/logger/error.logger"));
const stack_tracer_1 = __importDefault(require("../utils/helpers/stack-tracer"));
const uuid_1 = require("uuid");
const chat_1 = require("../utils/helpers/chat");
// Global Error Handler
const botErrorFilter = (exception, ctx) => {
    const errorLogger = new error_logger_1.default('BOT');
    let stackInfo;
    const message = exception.message || 'Internal Server Error';
    const sender = (0, chat_1.findSender)(ctx);
    const messageTrace = (0, chat_1.getMessage)(ctx);
    const loggerResponse = {
        id: (0, uuid_1.v4)(),
        botMessageType: messageTrace.messsageType,
        botMessageValue: messageTrace.value,
        telegramId: sender.id,
        timestamp: new Date().toISOString(),
        stack: exception instanceof Error ? exception.stack : '',
    };
    if (exception instanceof Error) {
        stackInfo = (0, stack_tracer_1.default)(exception === null || exception === void 0 ? void 0 : exception.stack);
    }
    errorLogger.log(typeof message !== 'string' ? message.message : message, Object.assign(Object.assign({}, stackInfo), loggerResponse));
    return ctx.replyWithHTML('<b>Something has went wrong</b>\n<i>please restart the bot and try again later </i> ');
};
// Export GEH
exports.default = botErrorFilter;
//# sourceMappingURL=bot-error.filter.js.map