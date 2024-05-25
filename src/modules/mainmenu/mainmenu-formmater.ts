import { MarkupButtons, urlButton } from '../../ui/button';
import config from '../../config/config';
import { TableMarkupKeyboardButtons } from '../../types/ui';

type FAQ = {
  question: string;
  answer: string;
};
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
      { text: 'FAQ', cbString: '' },
      { text: 'Terms and Conditions', cbString: '' },
    ],
    [
      { text: 'About Us', cbString: '' },
      { text: 'Contact Us', cbString: '' },
    ],
    [
      { text: 'Customer Service', cbString: '' },
      { text: 'Back', cbString: '' },
    ],
  ];

  faqs: FAQ[] = [
    {
      question: 'how long do quetios take to be appoved',
      answer: 'Questiosn can take from less than hour to a day or two to be appvroded',
    },
    {
      question: 'is my identity hidden',
      answer: 'Yes!, ther is no way for other to know who you truely are',
    },
  ];
  constructor() {}
  chooseServiceDisplay(round: number) {
    if (round == 2) return [this.messages.selectOptionPrompt, MarkupButtons(this.mainMenuOptionsSecondRound)];
    else return [this.messages.selectOptionPrompt, MarkupButtons(this.mainMenuOptionsFristRound)];
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

  formatFAQ() {
    let index = 0;
    let responseMessage = `-------------  <b>Frequently Asked Questions</b> ------------\n\n`;
    for (const { question, answer } of this.faqs) {
      responseMessage += `<b>${index + 1}. ${question}</b>\n  <b>---</b> ${answer}\n\n`;

      index++;
    }

    return responseMessage;
  }
}

export default MainmenuFormatter;
