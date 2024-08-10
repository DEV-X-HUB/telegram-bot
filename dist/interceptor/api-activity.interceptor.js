"use strict";
// Global Error Handler - geh
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const activity_logger_1 = __importDefault(require("../utils/logger/activity-logger"));
// Global Error Handler
const APIActivityInterceptor = (request, response, next) => {
    const activityLogger = new activity_logger_1.default('API');
    let stackInfo;
    //   console.log(response);
    const activityLog = {
        id: (0, uuid_1.v4)(),
        path: request.url,
        method: request.method,
        ip: request.ip,
        timestamp: new Date().toISOString(),
        res: {},
    };
    const originalSend = response.send;
    const originalJson = response.json;
    // Override response.send
    response.send = function (body) {
        activityLog.res = body;
        response.send = originalSend; // Restore original send method
        return response.send(body);
    };
    // Override response.json
    response.json = function (body) {
        activityLog.res = body;
        response.json = originalJson; // Restore original json method
        return response.json(body);
    };
    response.on('finish', () => {
        activityLogger.log('', Object.assign(Object.assign({}, stackInfo), activityLog));
    });
    next();
};
// Export GEH
exports.default = APIActivityInterceptor;
//# sourceMappingURL=api-activity.interceptor.js.map