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
exports.cleanUpImages = exports.saveImages = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const axios_1 = __importDefault(require("axios"));
const path_1 = require("path");
/**
 * Saves images to the specified folder and returns their paths.
 * @param folderName - The name of the folder where images will be saved.
 * @param fileIds - An array of file IDs to fetch and save.
 * @param fileLinks - An array of file url from .
 * @returns An array of file paths where the images are stored.
 */
const saveImages = (_a) => __awaiter(void 0, [_a], void 0, function* ({ folderName, fileIds, fileLinks }) {
    const folderPath = (0, path_1.resolve)(process.cwd(), 'uploads', 'images', folderName);
    yield fs_extra_1.default.ensureDir(folderPath);
    const filePaths = [];
    try {
        for (let i = 0; i < fileIds.length; i++) {
            const response = yield axios_1.default.get(fileLinks[i], { responseType: 'arraybuffer' });
            const filePath = (0, path_1.join)(folderPath, `image_${fileIds[i]}_${i}.jpg`);
            yield fs_extra_1.default.writeFile(filePath, response.data);
            filePaths.push(filePath);
        }
    }
    catch (error) {
        console.error('Error saving images:', error);
        return { filePaths, status: 'fail', msg: error.message };
    }
    console.log(filePaths);
    return { filePaths, status: 'success', msg: '' };
});
exports.saveImages = saveImages;
const cleanUpImages = (_b) => __awaiter(void 0, [_b], void 0, function* ({ filePaths }) {
    for (const filePath of filePaths) {
        try {
            yield fs_extra_1.default.remove(filePath);
        }
        catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
            throw error;
        }
    }
});
exports.cleanUpImages = cleanUpImages;
//# sourceMappingURL=image.js.map