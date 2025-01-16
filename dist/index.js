"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("./loaders/bot"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const routes_1 = __importDefault(require("./api/routes"));
const cors_1 = __importDefault(require("cors"));
const api_error_filter_1 = __importDefault(require("./exception-filters/api-error.filter"));
const api_activity_interceptor_1 = __importDefault(require("./interceptor/api-activity.interceptor"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const ignite = () => {
    const bot = (0, bot_1.default)();
    if (bot) {
        app.use(bot.webhookCallback('/secret-path'));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        // ROUTES
        app.use(api_activity_interceptor_1.default);
        app.use('/admin', routes_1.default);
        app.use(api_error_filter_1.default);
        const server = app.listen(config_1.default.port, () => {
            console.log(`bot is running on port ${config_1.default.port}`);
        });
        // Graceful shutdown
        process.once('SIGINT', () => {
            bot.stop('SIGINT');
            server.close();
        });
        process.once('SIGTERM', () => {
            bot.stop('SIGTERM');
            server.close();
        });
    }
    else
        console.log('bot is not initailized  ');
};
ignite();
//# sourceMappingURL=index.js.map