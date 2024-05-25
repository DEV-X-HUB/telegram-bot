export type NotifyOption = 'follower' | 'friend' | 'none';

export type PostCategory =
  | 'Section 1A'
  | 'Section 1B'
  | 'Section 1C'
  | 'Section 3'
  | 'Section 2'
  | 'Service4ChickenFarm'
  | 'Service4Construction'
  | 'Service4Manufacture'
  | 'Service 3';

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
