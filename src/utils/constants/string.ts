import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../types/components';
import { PostCategory } from '../../types/params';

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

// check if the text is in the markup options
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

export const capitalize = (word: string) => {
  return word.charAt(0).toLocaleUpperCase() + word.slice(1);
};

export const getSectionName = (category: string) => {
  switch (category) {
    case 'Section 1A':
      return 'Service1A';
    case 'Section 1B':
      return 'Service1B';
    case 'Section 1C':
      return 'Service1C';
    case 'Section 1A':
      return 'Service1A';
    case 'Section 1A':
      return 'Service1A';

    case 'Chicken Farm':
      return 'Service4ChickenFarm';
    case 'Construction':
      return 'Service4Construction';
    case 'Manufacture':
      return 'Service4Manufacture';
  }
};
