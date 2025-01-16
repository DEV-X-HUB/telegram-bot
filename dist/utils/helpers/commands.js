"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCommands = void 0;
const bot_1 = __importDefault(require("../../loaders/bot"));
// Display help with commands and descriptions
function setCommands(commands) {
    const bot = (0, bot_1.default)();
    if (bot != null) {
        return bot.telegram.setMyCommands(commands.map((command) => ({
            command: command.name,
            description: command.description,
        })));
    }
}
exports.setCommands = setCommands;
//# sourceMappingURL=commands.js.map