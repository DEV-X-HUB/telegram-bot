export type NotifyOption = 'follower' | 'friend' | 'none';

export type PostCategory =
  | 'Section 1A'
  | 'Section 1B'
  | 'Section 1C'
  | 'Section 3'
  | 'Section 2'
  | 'ChickenFarm'
  | 'Construction'
  | 'Manufacture';

export type FAQ = {
  question: string;
  answer: string;
};

export type TermAndConditions = {
  intro: string;
  details: TermAndCondition[];
};

export type TermAndCondition = {
  title: string;
  description: string;
};

export type CustomerServiceLink = {
  name: string;
  telegramLink: string;
};

export type ContactLink = {
  name: string;
  link: string;
};

export type ImageCounter = {
  id: number;
  waiting: boolean;
};

export type StackTraceInfo = {
  fileName: string;
  row: string;
  errorType: string;
  col: string;
};

export type MessageTrace = {
  messsageType: string;
  value: string;
};

export type SaveImageParams = { folderName: string; fileIds: string[]; fileLinks: string[] };
export type CleanUpImagesParams = { filePaths: string[] };
export type LoggerType = 'API' | 'BOT';
