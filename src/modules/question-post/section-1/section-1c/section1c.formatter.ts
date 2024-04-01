import { InlineKeyboardButtons, MarkupButtons } from '../../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../../types/components';

class Section1CFormatter {
  arBrOption: TableInlineKeyboardButtons;
  paperStampOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  woredaList: TableInlineKeyboardButtons;
  serviceType1: TableInlineKeyboardButtons;
  serviceType2: TableInlineKeyboardButtons;
  serviceType3: TableInlineKeyboardButtons;
  bIDiOption: TableInlineKeyboardButtons;
  constructor() {
    this.arBrOption = [
      [
        { text: 'AR', cbString: 'ar' },
        { text: 'BR', cbString: 'br' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.paperStampOption = [
      [
        { text: 'PS1', cbString: 'ps1' },
        { text: 'PS2', cbString: 'ps2' },
      ],

      [
        { text: 'PS3', cbString: 'ps3' },
        { text: 'PS4', cbString: 'ps4' },
      ],
      [
        { text: 'PS5', cbString: 'ps5' },
        { text: 'PS6', cbString: 'ps6' },
      ],
      [
        { text: 'PS7', cbString: 'ps7' },
        { text: 'PS8', cbString: 'ps8' },
      ],
      [
        { text: 'PS9', cbString: 'ps9' },
        { text: 'PS10', cbString: 'ps10' },
      ],
      [
        { text: 'PS11', cbString: 'ps11' },
        { text: 'PS12', cbString: 'ps12' },
      ],
      [
        { text: 'PS13', cbString: 'ps13' },
        { text: 'PS14', cbString: 'ps14' },
      ],
      [
        { text: 'PS15', cbString: 'ps15' },
        { text: 'PS16', cbString: 'ps16' },
      ],
      [
        { text: 'Other', cbString: 'other' },
        { text: 'Back', cbString: 'back' },
      ],
    ];
    this.backOption = [[{ text: 'Back', cbString: 'back' }]];
    this.woredaList = [
      [
        { text: 'woreda 1', cbString: 'woreda_1' },
        { text: 'woreda 2', cbString: 'woreda_2' },
      ],
      [
        { text: 'woreda 3', cbString: 'woreda_3' },
        { text: 'woreda 4', cbString: 'woreda_4' },
      ],
      [
        { text: 'woreda 5', cbString: 'woreda_5' },
        { text: 'woreda 6', cbString: 'woreda_6' },
      ],
      [
        { text: 'woreda 7', cbString: 'woreda_7' },
        { text: 'woreda 8', cbString: 'woreda_8' },
      ],
      [
        { text: 'woreda 9', cbString: 'woreda_9' },
        { text: 'woreda 10', cbString: 'woreda_10' },
      ],
      [
        { text: 'other', cbString: 'other' },
        { text: 'back', cbString: 'back' },
      ],
    ];
    this.serviceType1 = [
      [
        { text: 'Policy', cbString: 'policy' },
        { text: 'Planning', cbString: 'planning' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.serviceType2 = [
      [
        { text: 'Policy', cbString: 'policy' },
        { text: 'Planning', cbString: 'planning' },
      ],
      [
        { text: 'Research', cbString: 'research' },
        { text: 'Evaluation', cbString: 'evaluation' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.serviceType3 = [
      [
        { text: 'Policy', cbString: 'policy' },
        { text: 'Planning', cbString: 'planning' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
    this.bIDiOption = [
      [
        { text: 'BI', cbString: 'bi' },
        { text: 'DI', cbString: 'di' },
      ],
      [{ text: 'Back', cbString: 'back' }],
    ];
  }

  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }
  //   chooseOptionString() {
  //     return ['Please Choose on category from the options'];
  //   }
  //   chooseOptionDisplayString() {
  //     return ['Please Choose from category from the options'];
  //   }
  //   chooseOptionDisplay() {
  //     return [MarkupButtons(this.categories, true)];
  //   }
  arBrOptionDisplay() {
    return ['Please Choose from two', InlineKeyboardButtons(this.arBrOption)];
  }
  choosePaperStampDisplay() {
    return ['Please Choose Paper Stamp', InlineKeyboardButtons(this.paperStampOption)];
  }
  woredaListDisplay() {
    return ['Please Choose Your Woreda', InlineKeyboardButtons(this.woredaList)];
  }
  serviceType1Display() {
    return ['Please Choose Service Type 1', InlineKeyboardButtons(this.serviceType1)];
  }
  serviceType2Display() {
    return ['Please Choose Service Type 2', InlineKeyboardButtons(this.serviceType2)];
  }
  serviceType3Display() {
    return ['Please Choose Service Type 3', InlineKeyboardButtons(this.serviceType3)];
  }

  yearOfConfirmationPrompt() {
    return ['Enter Year of Confirmation ', this.goBackButton(false)];
  }
  bIDIOptionDisplay() {
    return ['Please Choose ID first Icon', InlineKeyboardButtons(this.bIDiOption), this.goBackButton(false)];
  }

  lastDigitPrompt() {
    return ['Enter Last Digit ', this.goBackButton(false)];
  }
  descriptionPrompt() {
    return ['Enter Description maximum 200 words ', this.goBackButton(false)];
  }
  photoPrompt() {
    return ['Attach four photos ', this.goBackButton(false)];
  }

  getPreviewData(state: any) {
    return `#${state.category.replace(/ /g, '_')}\n________________\n\n${state.ar_br.toLocaleUpperCase()}\n\nPaper Stamp: ${state.paper_stamp} \n\nWoreda: ${state.woreda} \n\nService type 1 : ${state.service_type_1} \n\nService type 2 : ${state.service_type_2} \n\nService type 3 : ${state.service_type_3} \n\nYear of Confirmation: ${state.year_of_confirmation}\n\nLast digit: ${state.last_digit} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nBy: Natnael\n\nStatus : ${state.status}`;
  }

  preview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'Edit', cbString: 'preview_edit' },
          { text: 'Notify settings', cbString: 'notify_settings' },
          { text: 'Post', cbString: 'post_data' },
        ],
        [
          { text: 'Mention previous post', cbString: 'mention_previous_post' },
          { text: 'Cancel', cbString: 'cancel' },
        ],
      ]),
    ];
  }

  //   editPreview(state: any) {
  //     return [
  //       this.getPreviewData(state),
  //       InlineKeyboardButtons([
  //         [
  //           { text: 'AR/BR', cbString: 'ar_br' },
  //           { text: 'BI/DI', cbString: 'bi_di' },
  //         ],

  //         [
  //           { text: 'Location', cbString: 'location' },
  //           { text: 'Woreda', cbString: 'woreda' },
  //         ],
  //         [
  //           { text: 'Last Digit', cbString: 'last_digit' },
  //           { text: 'Description', cbString: 'description' },
  //         ],
  //         [
  //           { text: 'photo', cbString: 'photo' },
  //           { text: 'Cancel', cbString: 'cancel' },
  //         ],
  //         [{ text: 'Done', cbString: 'editing_done' }],
  //       ]),
  //     ];
  //   }

  //   async editFieldDispay(editFiled: string) {
  //     switch (editFiled) {
  //       case 'ar_br':
  //         return this.arBrOptionDisplay();
  //       case 'bi_di':
  //         return this.bIDIOptionDisplay();
  //       case 'woreda':
  //         return this.woredaListDisplay();
  //       case 'last_digit':
  //         return this.lastDidtitPrompt();
  //       case 'location':
  //         return this.locationPrompt();
  //       case 'description':
  //         return this.descriptionPrompt();

  //       case 'photo':
  //         return this.photoPrompt();
  //       case 'cancel':
  //         return await this.goBackButton();
  //       default:
  //         return ['none'];
  //     }
  //   }

  //   previewCallToAction() {
  //     return ['Preview your post and press once you are done'];
  //   }

  //   postingSuccessful() {
  //     return ['Posted Successfully'];
  //   }
  //   postingError() {
  //     return ['Post Error'];
  //   }
  paperTimestampError() {
    return ['Please Choose Paper Stamp'];
  }

  unknownOptionError() {
    return ['Unknown option. Please use buttons to choose'];
  }
}

export default Section1CFormatter;