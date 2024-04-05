import { Markup } from 'telegraf';
import { urlButton } from '../../ui/button';
import config from '../../config/config';

class MainmenuFormatter {
  constructor() {}
  chooseServiceDisplay() {
    return [
      'Select an option ',
      Markup.keyboard([
        [Markup.button.callback('Service 1', 'posting'), Markup.button.callback('Service 2', 'Service 2')],
        [Markup.button.callback('Service 3', 'Service 3'), Markup.button.callback('Service 4', 'Service 4')],
        [Markup.button.callback('Service 5', 'Service 5'), Markup.button.callback('Profile', 'Service 6')],
        [Markup.button.callback('Service 7', 'Service 7'), Markup.button.callback('Next', 'Next')],
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
