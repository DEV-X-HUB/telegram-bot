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
const uuid_1 = require("uuid");
class ChatService {
    constructor() { }
    fetchReceivedMessage(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield db_connecion_1.default.message.findMany({
                    where: {
                        receiver_id: user_id,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                        receiver: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                    },
                });
                return { status: 'success', messages };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, messages: [] };
            }
        });
    }
    fetchSendMessage(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield db_connecion_1.default.message.findMany({
                    where: {
                        sender_id: user_id,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                        receiver: {
                            select: {
                                id: true,
                                display_name: true,
                                chat_id: true,
                            },
                        },
                    },
                });
                return { status: 'success', messages };
            }
            catch (error) {
                console.error('Error checking if user is following:', error);
                return { status: 'fail', message: `unable to make operation`, messages: [] };
            }
        });
    }
    createMessage(user_id, receiver_id, message, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield db_connecion_1.default.message.create({
                    data: { id: (0, uuid_1.v4)(), content: message, sender_id: user_id, receiver_id, type: type || 'message' },
                });
                return { success: true, data: newUser, message: 'user created' };
            }
            catch (error) {
                console.log(error);
                return { success: false, data: null, message: error === null || error === void 0 ? void 0 : error.message };
            }
        });
    }
}
exports.default = ChatService;
//# sourceMappingURL=chat.service.js.map