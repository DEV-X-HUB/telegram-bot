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
const db_connecion_1 = __importDefault(require("../../loaders/db-connecion"));
const auth_1 = require("../../middleware/auth");
const chat_1 = require("../../utils/helpers/chat");
const mainmenu_formmater_1 = __importDefault(require("./mainmenu-formmater"));
const mainMenuFormmater = new mainmenu_formmater_1.default();
class MainMenuService {
    constructor() { }
    checkUsersInchannel(bot, checkRejoin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield db_connecion_1.default.user.findMany({
                    select: {
                        first_name: true,
                        tg_id: true,
                        chat_id: true,
                    },
                });
                if (users) {
                    for (let { chat_id, first_name, tg_id } of users) {
                        const { status, data: isUserJoined, message } = yield (0, auth_1.checkUserInChannel)(parseInt(tg_id));
                        if (status == 'fail')
                            console.error(...mainMenuFormmater.formatFailedJoinCheck(message || ''));
                        if (!isUserJoined) {
                            yield (0, chat_1.messageJoinPrompt)(bot, parseInt(chat_id), checkRejoin
                                ? mainMenuFormmater.formatReJoinMessage(first_name)[0]
                                : mainMenuFormmater.formatJoinMessage(first_name)[0]);
                        }
                    }
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
}
exports.default = MainMenuService;
//# sourceMappingURL=mainmenu-service.js.map