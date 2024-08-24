"use strict";
// Global Error Handler - geh
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_logger_1 = __importDefault(require("../utils/logger/error.logger"));
const stack_tracer_1 = __importDefault(require("../utils/helpers/stack-tracer"));
const uuid_1 = require("uuid");
// Global Error Handler
const APIErrorFilter = (exception, request, response, next) => {
    const errorLogger = new error_logger_1.default('API');
    let stackInfo;
    const status = exception.status || 'ERROR';
    const statusCode = exception.statusCode || 500;
    const message = exception.message || 'Internal Server Error';
    const loggerResponse = {
        id: (0, uuid_1.v4)(),
        status: exception.statusCode,
        path: request.url,
        method: request.method,
        ip: request.ip,
        timestamp: new Date().toISOString(),
        stack: exception instanceof Error ? exception.stack : '',
    };
    if (exception instanceof Error) {
        stackInfo = (0, stack_tracer_1.default)(exception === null || exception === void 0 ? void 0 : exception.stack);
    }
    errorLogger.log(typeof message !== 'string' ? message.message : message, Object.assign(Object.assign({}, stackInfo), loggerResponse));
    response.status(statusCode).json({
        statusCode,
        message,
        status,
    });
};
// Export GEH
exports.default = APIErrorFilter;
//# sourceMappingURL=api-error.filter.js.map