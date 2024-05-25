import { MarkupButtons, urlButton } from '../../ui/button';
import config from '../../config/config';
import { TableMarkupKeyboardButtons } from '../../types/ui';

class MainmenuFormatter {
  messages = {
    selectOptionPrompt: 'Select an option',
  };
  mainMenuOptionsFristRound: TableMarkupKeyboardButtons = [
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
      { text: 'Browse', cbString: '' },
    ],
    [
      { text: 'Profile', cbString: '' },
      { text: 'Next', cbString: '' },
    ],
  ];
  mainMenuOptionsSecondRound: TableMarkupKeyboardButtons = [
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
    [
      { text: 'Profile', cbString: '' },
      { text: 'Next', cbString: '' },
    ],
  ];
  constructor() {}
  chooseServiceDisplay() {
    return [this.messages.selectOptionPrompt, MarkupButtons(this.mainMenuOptionsFristRound)];
  }
  chooseServiceDisplayNext() {
    return [this.messages.selectOptionPrompt, MarkupButtons(this.mainMenuOptionsSecondRound)];
  }
  formatJoinMessage(first_name: string) {
    return [
      `Hey ${first_name} 👋\nIt seems like you haven't joined our channel yet,the channel is where we post questions asked by you and others,\n\nJoin using the button below!`,
      urlButton('Join', `https://t.me/${config.channel_username}`),
    ];
  }
  formatFailedJoinCheck(message: string) {
    return [`<b>Failed to check user in channel</b>\n<i>${message}</i> \n<b>Please try again!</b>`];
  }
}

export default MainmenuFormatter;
