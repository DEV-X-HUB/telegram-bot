import { InlineKeyboardButtons, MarkupButtons } from '../../../ui/button';
import { TableInlineKeyboardButtons, TableMarkupKeyboardButtons } from '../../../types/components';
import { areEqaul } from '../../../utils/constants/string';

class QustionPostSectionBFormatter {
  categories: TableMarkupKeyboardButtons;
  urgency: TableMarkupKeyboardButtons;
  arBrOption: TableInlineKeyboardButtons;
  bIDiOption: TableInlineKeyboardButtons;
  OpSeOption: TableInlineKeyboardButtons;
  backOption: TableMarkupKeyboardButtons;
  woredaList: TableInlineKeyboardButtons;
  messages = {
    dateOfIssuePrompt: 'Date of Issue mm/yyyy',
    dateOfExpirePrompt: 'Date of Expire mm/yyyy',
    biDiPrompt: 'Please Choose ID first Icon',
    descriptionPrompt: 'Enter Description maximum 200 words ',
    chooseWoredaPrompt: 'Please Choose Your Woreda',
    originalLocationPrompt: 'Original Location ',
    invalidDateErrorPrompt: 'Invalid Date format',
    categoriesPrompt: 'Please Choose main category',
    subCategoriesPrompt: 'Please Choose Sub Category category',
    conditonPrompt: 'What is the condition',
    useButtonError: 'Please use Buttons to select options',
  };
  constructor() {
    this.categories = [
      [
        { text: 'Main 1', cbString: 'main_1' },
        { text: 'Main 2', cbString: 'main_2' },
      ],
      [
        { text: 'Main 3', cbString: 'main_3' },
        { text: 'Main 4', cbString: 'main_4' },
      ],
      [
        { text: 'Main 5', cbString: 'main_5' },
        { text: 'Main 6', cbString: 'main_6' },
      ],
      [
        { text: 'Main 7', cbString: 'main_7' },
        { text: 'Main 8', cbString: 'main_8' },
      ],
      [
        { text: 'Main 9', cbString: 'main_8' },
        { text: 'Main 10', cbString: 'main_10' },
      ],

      [{ text: 'Back', cbString: 'Back' }],
    ];
    this.urgency = [
      [
        { text: 'urgent 1', cbString: 'urgent_1' },
        { text: 'urgent 2', cbString: 'urgent_2' },
      ],
      [
        { text: 'urgent 3', cbString: 'urgent_3' },
        { text: 'urgent 4', cbString: 'urgent_4' },
      ],
      [
        { text: 'urgent 5', cbString: 'urgent_5' },
        { text: 'urgent 6', cbString: 'urgent_6' },
      ],
      [
        { text: 'urgent 7', cbString: 'urgent_7' },
        { text: 'Back', cbString: 'Back' },
      ],
    ];
    this.arBrOption = [
      [
        { text: 'AR', cbString: 'ar' },
        { text: 'BR', cbString: 'br' },
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
    this.OpSeOption = [
      [
        { text: 'Op', cbString: 'op' },
        { text: 'SE', cbString: 'se' },
      ],
      [{ text: 'Back', cbString: 'back' }],
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
  }
  generateSubCatagory(mainCategory: string) {
    const mainCategoryNumber = mainCategory.split('_')[1];
    const subCatagoryType = String.fromCharCode(64 + +mainCategoryNumber);
    return [
      [
        { text: `#Sub${subCatagoryType}1`, cbString: `#Sub${subCatagoryType}_1` },
        { text: `#Sub${subCatagoryType}2`, cbString: `#Sub${subCatagoryType}_2` },
      ],
      [
        { text: `#Sub${subCatagoryType}3`, cbString: `#Sub${subCatagoryType}_3` },
        { text: `#Sub${subCatagoryType}4`, cbString: `#Sub${subCatagoryType}_4` },
      ],
      [
        { text: `#Sub${subCatagoryType}5`, cbString: `#Sub${subCatagoryType}_5` },
        { text: `#Sub${subCatagoryType}6`, cbString: `#Sub${subCatagoryType}_6` },
      ],
      [
        { text: `#Sub${subCatagoryType}7`, cbString: `#Sub${subCatagoryType}_7` },
        { text: `#Sub${subCatagoryType}8`, cbString: `#Sub${subCatagoryType}_8` },
      ],
      [
        { text: `#Sub${subCatagoryType}9`, cbString: `#Sub${subCatagoryType}_8` },
        { text: `Back`, cbString: `Back` },
      ],
    ];
  }
  goBackButton(oneTime: boolean = true) {
    return MarkupButtons(this.backOption, oneTime);
  }
  InsertTiteDisplay() {
    return ['Insert Title ?', this.goBackButton(true)];
  }
  mainCategoryOption() {
    return [this.messages.categoriesPrompt, InlineKeyboardButtons(this.categories)];
  }
  bIDIOptionDisplay() {
    return [this.messages.biDiPrompt, InlineKeyboardButtons(this.bIDiOption)];
  }
  lastDidtitPrompt() {
    return ['Enter Last Digit ', this.goBackButton(false)];
  }
  subCategoryOption(mainCategory: string) {
    return [this.messages.subCategoriesPrompt, InlineKeyboardButtons(this.generateSubCatagory(mainCategory))];
  }

  OpSeCondtionOptionDisplay() {
    return [this.messages.conditonPrompt, InlineKeyboardButtons(this.OpSeOption)];
  }
  urgencyOptionDisplay() {
    return [this.messages.conditonPrompt, InlineKeyboardButtons(this.urgency)];
  }
  dateOfIssue() {
    return [this.messages.dateOfIssuePrompt, this.goBackButton(true)];
  }
  dateOfExpire() {
    return [this.messages.dateOfExpirePrompt, , this.goBackButton(true)];
  }
  originalLocation() {
    return [this.messages.originalLocationPrompt, , this.goBackButton(true)];
  }
  woredaListDisplay() {
    return [this.messages.chooseWoredaPrompt, InlineKeyboardButtons(this.woredaList)];
  }

  locationPrompt() {
    return ['Enter sub city and location ', this.goBackButton(false)];
  }
  descriptionPrompt() {
    return [this.messages.descriptionPrompt, this.goBackButton(false)];
  }
  photoPrompt() {
    return ['Attach four photos ', this.goBackButton(false)];
  }

  getPreviewData(state: any) {
    console.log(state);
    if (areEqaul(state.mainCategory, 'main_4'))
      return `${state.subCatagory}\n________________\n\n${state.title} \n\nCondtition: ${state.condition}  \n\nDate of Issue: ${state.date_of_issue} \n\nDate of Expire: ${state.date_of_expire} \n\nOriginal Location: ${state.location}\n\nWoreda: ${state.woreda} \n\nLast digit: ${state.last_digit} ${state.bi_di.toLocaleUpperCase()} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nBy: Natnael\n\nStatus : ${state.status}`;
    return `${state.subCatagory}\n________________\n\n${state.title}  \n\nCondition: ${state.condition} \n\nWoreda: ${state.woreda} \n\nLast digit: ${state.last_digit} ${state.bi_di.toLocaleUpperCase()} \n\nDescription: ${state.description} \n\nContact: @resurrection99 \n\nBy: Natnael\n\nStatus : ${state.status}`;
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

  editPreview(state: any) {
    return [
      this.getPreviewData(state),
      InlineKeyboardButtons([
        [
          { text: 'AR/BR', cbString: 'ar_br' },
          { text: 'BI/DI', cbString: 'bi_di' },
        ],

        [
          { text: 'Location', cbString: 'location' },
          { text: 'Woreda', cbString: 'woreda' },
        ],
        [
          { text: 'Last Digit', cbString: 'last_digit' },
          { text: 'Description', cbString: 'description' },
        ],
        [
          { text: 'photo', cbString: 'photo' },
          { text: 'Cancel', cbString: 'cancel' },
        ],
        [{ text: 'Done', cbString: 'editing_done' }],
      ]),
    ];
  }

  async editFieldDispay(editFiled: string) {
    switch (editFiled) {
      case 'ar_br':
        return this.OpSeCondtionOptionDisplay();
      case 'bi_di':
        return this.bIDIOptionDisplay();
      case 'woreda':
        return this.woredaListDisplay();
      case 'last_digit':
        return this.lastDidtitPrompt();
      case 'location':
        return this.locationPrompt();
      case 'description':
        return this.descriptionPrompt();

      case 'photo':
        return this.photoPrompt();
      case 'cancel':
        return await this.goBackButton();
      default:
        return ['none'];
    }
  }

  previewCallToAction() {
    return ['Preview your post and press once you are done'];
  }

  postingSuccessful() {
    return ['Posted Successfully'];
  }
  postingError() {
    return ['Post Error'];
  }
}

export default QustionPostSectionBFormatter;
