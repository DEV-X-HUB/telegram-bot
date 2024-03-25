import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../types/components';

export const areEqaul = (text1: string, text2: string, ignoreCase?: boolean) => {
  if (ignoreCase) return text1.toLocaleLowerCase().trim() == text2.toLocaleLowerCase().trim();
  return text1.trim() == text2.trim();
};

export const isInInlineOption = (text: string, options: TableInlineKeyboardButtons) => {
  let exists = false;
  options.forEach((rowOption) => {
    rowOption.forEach((option) => {
      if (areEqaul(option.cbString, text, true)) exists = true;
    });
  });
  return exists;
};
export const isInMarkUPOption = (text: string, options: TableMarkupKeyboardButtons) => {
  let exists = false;
  options.forEach((rowOption) => {
    rowOption.forEach((option) => {
      if (areEqaul(option.text, text, true)) exists = true;
    });
  });
  return exists;
};

export const capitalizeFirstLetter = (word: string) => {
  return word[0].toLocaleUpperCase() + word.slice(1);
};
