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
const Winston = __importStar(require("winston"));
const DailyRotateFile = __importStar(require("winston-daily-rotate-file"));
const config_1 = __importDefault(require("../../config/config"));
class WinstonErrorLogger {
    constructor(loggerType) {
        // define logger ratation file based on logger type
        const dirname = loggerType == 'API' ? 'api' : 'bot';
        this.logger = Winston.createLogger({
            format: Winston.format.combine(Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Winston.format.json()),
            transports: [
                new DailyRotateFile.default({
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20mb',
                    maxFiles: '14d',
                    dirname: `logs/${dirname}/errors`,
                    filename: `${loggerType}_%DATE%-error.log`,
                    level: 'error',
                }),
            ],
        });
        if (config_1.default.env !== 'production') {
            const consoleTransport = new Winston.transports.Console({
                format: Winston.format.combine(Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), Winston.format.simple(), Winston.format.colorize()),
            });
            this.logger.add(consoleTransport);
        }
    }
    log(message, metadata) {
        this.logger.error(message, Object.assign({}, metadata));
    }
}
exports.default = WinstonErrorLogger;
//# sourceMappingURL=error.logger.js.map