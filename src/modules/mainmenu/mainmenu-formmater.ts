import { MarkupButtons, urlButton } from '../../ui/button';
import config from '../../config/config';
import { TableMarkupKeyboardButtons } from '../../types/components';

class MainmenuFormatter {
  messages = {
    selectOptionPrompt: 'Select an option',
  };
  mainMenuOptions: TableMarkupKeyboardButtons = [
    [
      { text: 'Service 1', cbString: '' },
      { text: 'Service 2', cbString: '' },
    ],
    [
      { text: 'Service 3', cbString: '' },
      { text: 'Service 4', cbString: '' },
    ],
    [
      { text: '🔍 Search Questions', cbString: '' },
      { text: 'Service 4', cbString: '' },
    ],
    [{ text: 'Next', cbString: '' }],
  ];
  constructor() {}
  chooseServiceDisplay() {
    return ['Select an option ', MarkupButtons(this.mainMenuOptions)];
  }
  formatJoinMessage(first_name: string) {
    return [
      `Hey ${first_name} 👋\nIt seems like you haven't joined our channel yet,the channel is where we post questions asked by you and others,\n\nJoin using the button below!`,
      urlButton('Join', `https://t.me/${config.channel_username}`),
    ];
  }
}

export default MainmenuFormatter;
