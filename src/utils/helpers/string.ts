import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../types/ui';
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
    case 'Section 2':
      return 'Service2';
    case 'Section 3': {
      return 'Service3';
    }

    case 'Chicken Farm':
      return 'Service4ChickenFarm';
    case 'Construction':
      return 'Service4Construction';
    case 'Manufacture':
      return 'Service4Manufacture';
  }
};

export const formatAccountCreationEmailMsg = (password: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Created</title>
  </head>
  <body>
      <div style="font-family: Arial, sans-serif; text-align: center; margin: 20px;">
          <h1>🎉 Your admin account have been created successfuly! 🎉</h1>
          <p style="font-size: 18px;">Use this password to sign in: <strong>${password}</strong></p>
          <p style="font-size: 14px; color: gray;">This message is generated by DummyBot. Please do not reply.</p>
      </div>
  </body>
  </html>
  `;
};
export const formatResetOptEmailMsg = (otp: string) => {
  return `<!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Reset Your Password</title>
 </head>
 <body>
     <div style="font-family: Arial, sans-serif; text-align: center; margin: 20px;">
         <h1>🔒 Use this OTP to reset your password: <span style="color: red; font-weight: bold;">${otp}</span></h1>
         <p style="font-size: 14px; color: gray;">This message is generated by DummyBot. Please do not reply.</p>
     </div>
 </body>
 </html>
 `;
};