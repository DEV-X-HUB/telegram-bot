import { Markup } from 'telegraf';
import { InlineKeyboardButtons } from '../components/button';

class MainmenuFormatter {
  constructor() {}
  chooseServiceDisplay() {
    return [
      Markup.keyboard([
        [Markup.button.callback('Service_1', 'Service 1'), Markup.button.callback('Service_2', 'Service 2')],
        [Markup.button.callback('Service_3', 'Service 3'), Markup.button.callback('Service_4', 'Service 4')],
        [Markup.button.callback('Service_5', 'Service 5'), Markup.button.callback('Service_6', 'Service 6')],
        [Markup.button.callback('Service_7', 'Service 7'), Markup.button.callback('Next', 'Next')],
      ]).resize(),
    ];
  }
}

export default MainmenuFormatter;

// export const formatJoinMessage = (first_name: string) => {
//   return `Hey ${first_name} 👋

// It seems like you haven't joined our channel yet,
// the channel is where we post questions asked by you and others,
// Join using the button below!`;
// };
