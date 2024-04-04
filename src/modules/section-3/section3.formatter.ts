import { InlineKeyboardButtons, MarkupButtons } from '../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../types/components';

class Section3Formatter {
  birthOrMaritalOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  constructor() {
    this.birthOrMaritalOption = [
      [
        { text: 'Birth', cbString: 'birth' },
        { text: 'Marital', cbString: 'marital' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
  }
  birthOrMaritalOptionDisplay() {
    return ['Choose an option', InlineKeyboardButtons(this.birthOrMaritalOption)];
  }
  titlePrompt() {
    return ['What is the title?', this.goBackButton(false)];
  }
  descriptionPrompt() {
    return ['Enter description maximimum 45 words'];
  }
  photoPrompt() {
    return ['Attach four photos ', this.goBackButton(false)];
  }

  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }

  getPreviewData(state: any) {
    return `#${state.category.replace(/ /g, '_')}\n\n________________\n\nTitle: ${state.title} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nDashboard: BT1234567\n\nStatus : ${state.status}`;
  }
}

export default Section3Formatter;
