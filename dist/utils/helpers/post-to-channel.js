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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToChannel = void 0;
// Function that posts a message to a channel
const postToChannel = (ctx, message) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.telegram.sendMessage(process.env.CHANNEL_ID, message);
});
exports.postToChannel = postToChannel;
//# sourceMappingURL=post-to-channel.js.map