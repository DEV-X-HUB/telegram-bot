"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function parseStackTrace(stack) {
    const lines = stack.split('\n');
    const [type] = lines[0].split(':');
    const errorType = type;
    const stackInfo = {
        fileName: '',
        row: '',
        col: '',
        errorType,
    };
    const stackTracePattern = /at .+ \(([^:]+):(\d+):(\d+)\)/;
    const match = lines[1].match(stackTracePattern);
    if (match) {
        const [, filePath, row, col] = match;
        stackInfo.fileName = (0, path_1.basename)(filePath);
        stackInfo.row = row;
        stackInfo.col = col;
    }
    return stackInfo;
}
exports.default = parseStackTrace;
//# sourceMappingURL=stack-tracer.js.map