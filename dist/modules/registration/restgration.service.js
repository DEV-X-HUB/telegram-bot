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
class RegistrationService {
    constructor() { }
    isUserRegisteredWithPhone(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        phone_number: phoneNumber,
                    },
                });
                return Boolean(user);
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    isUserRegisteredWithTGId(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        tg_id: tgId.toString(),
                    },
                });
                if (user)
                    return true;
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    isUserActive(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_connecion_1.default.user.findUnique({
                    where: {
                        tg_id: tgId.toString(),
                    },
                });
                if ((user === null || user === void 0 ? void 0 : user.status) == 'ACTIVE')
                    return true;
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    registerUser(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doesUserExist = yield this.isUserRegisteredWithPhone(createUserDto.phone_number);
                if (doesUserExist)
                    return { success: false, message: 'user exists', data: null };
                const createUserResult = yield this.createUser(createUserDto);
                return createUserResult;
            }
            catch (error) {
                console.error(error);
                return { success: false, message: 'unknown error', data: null };
            }
        });
    }
    getUserCountry(tg_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_connecion_1.default.user.findFirst({ where: { tg_id: tg_id.toString() } });
            return user === null || user === void 0 ? void 0 : user.country;
        });
    }
    createUser(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield db_connecion_1.default.user.create({
                    data: Object.assign({ id: (0, uuid_1.v4)() }, createUserDto),
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
exports.default = RegistrationService;
//# sourceMappingURL=restgration.service.js.map