import { Markup } from 'telegraf';

export const urlButton = (buttonText: string, url: string, hidable?: boolean) => {
  return Markup.inlineKeyboard([Markup.button.url(buttonText, url, hidable)]);
};

// export const inlineKeyboard = (...buttonData: [string, string][]) => {
//   const keyboard = buttonData.map(([text, callbackData]) => Markup.button.callback(text, callbackData));
//   return Markup.inlineKeyboard(keyboard);
// };

export const inlineKeyboard = (title: any, buttons: any) => {
  if (!Array.isArray(buttons)) {
    throw new Error('Buttons argument must be an array of objects');
  }

  const keyboard = buttons.map((button) => {
    return {
      text: button.text,
      callback_data: button.callback_data,
    };
  });

  return {
    reply_markup: {
      inline_keyboard: [keyboard],
    },
  };
};

// export const inlineKeyboard = (text: string, callbackData: string) => {
//   return Markup.inlineKeyboard([Markup.button.callback(text, callbackData)]);
// };

// export const createInlineKeyboards = (...buttons: any) => {
//   const keyboard = [];
//   const rows = [];

//   for (const button of buttons) {
//     rows.push(Markup.button.callback(button.text, button.data));

//     // Check if enough buttons for a row (optional)
//     if (rows.length === 3) {
//       // Adjust as needed for desired columns
//       keyboard.push(rows);
//       rows.length = 0;
//     }
//   }

//   // Add the last row if buttons don't perfectly fit
//   if (rows.length > 0) {
//     keyboard.push(rows);
//   }

//   return Markup.inlineKeyboard(keyboard);
// };
