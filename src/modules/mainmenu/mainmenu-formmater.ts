import { Markup } from 'telegraf';
import { InlineKeyboardButtons, urlButton } from '../../components/button';
import config from '../../config/config';

class MainmenuFormatter {
  constructor() {}
  chooseServiceDisplay() {
    return [
      'Choose a service:',
      Markup.keyboard([
        [Markup.button.callback('Service_1', 'Service 1'), Markup.button.callback('Service_2', 'Service 2')],
        [Markup.button.callback('Service_3', 'Service 3'), Markup.button.callback('Service_4', 'Service 4')],
        [Markup.button.callback('Service_5', 'Service 5'), Markup.button.callback('Service_6', 'Service 6')],
        [Markup.button.callback('Service_7', 'Service 7'), Markup.button.callback('Next', 'Next')],
      ]).resize(),
    ];
  }
  formatJoinMessage(first_name: string) {
    return [
      `Hey ${first_name} 👋\nIt seems like you haven't joined our channel yet,the channel is where we post questions asked by you and others,\n\nJoin using the button below!`,
      urlButton('Join', `https://t.me/${config.channel_username}`),
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
