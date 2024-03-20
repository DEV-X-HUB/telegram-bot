import { Markup } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';

class Service1Formatter {
  constructor() {}
  chooseOptionDisplay() {
    return [
      Markup.keyboard([
        [Markup.button.callback('Option_1', 'Option 1'), Markup.button.callback('Option_2', 'Option 2')],
        [Markup.button.callback('Option_3', 'Option 3'), Markup.button.callback('Option_4', 'Option 4')],
        [Markup.button.callback('Option_5', 'Option 5'), Markup.button.callback('Option_6', 'Option 6')],
        [Markup.button.callback('Back', 'Back'), Markup.button.callback('Next', 'Next')],
      ]).resize(),
    ];
  }
  chooseNextOptionDisplay() {
    return [
      Markup.keyboard([
        [Markup.button.callback('Option 7', 'Option 7'), Markup.button.callback('Option 8', 'Option 8')],
        [Markup.button.callback('Option 9', 'Option 9'), Markup.button.callback('Back', 'Back')],
      ]).resize(),
    ];
  }
}

export default Service1Formatter;

// export const formatJoinMessage = (first_name: string) => {
//   return `Hey ${first_name} 👋

// It seems like you haven't joined our channel yet,
// the channel is where we post questions asked by you and others,
// Join using the button below!`;
// };
