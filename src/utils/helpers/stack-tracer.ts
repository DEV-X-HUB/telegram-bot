import { basename } from 'path';
import { StackTraceInfo } from '../../types/params';

export default function parseStackTrace(stack: string): StackTraceInfo {
  const lines = stack.split('\n');
  const [type] = lines[0].split(':');
  const errorType = type;

  const stackInfo: StackTraceInfo = {
    fileName: '',
    row: '',
    col: '',
    errorType,
  };

  const stackTracePattern = /at .+ \(([^:]+):(\d+):(\d+)\)/;
  const match = lines[1].match(stackTracePattern);

  if (match) {
    const [, filePath, row, col] = match;
    stackInfo.fileName = basename(filePath);
    stackInfo.row = row;
    stackInfo.col = col;
  }
  return stackInfo;
}
