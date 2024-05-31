import { text } from 'stream/consumers';
import config from '../../config/config';
import { PostCategory } from '../../types/params';
import { TableMarkupKeyboardButtons } from '../../types/ui';
import { InlineKeyboardButtons, urlButton } from '../../ui/button';
import { areEqaul, getSectionName } from '../../utils/helpers/string';
import Post1AFormatter from '../post/section-1/section-1a/section-a.formatter';
import Post1BFormatter from '../post/section-1/section-1b/section-b.formatter';
import Post1CFormatter from '../post/section-1/section-1c/section1c.formatter';
import Post2Formatter from '../post/section-2/section-2.formatter';
import Section3Formatter from '../post/section-3/section-3.formatter';
import ChickenFarmFormatter from '../post/section-4/chicken-farm/chicken-farm.formatter';
import ConstructionFormatter from '../post/section-4/construction/construction.formatter';
import ManufactureFormatter from '../post/section-4/manufacture/manufacture.formatter';
import { displayDialog } from '../../ui/dialog';

const post1AFormatter = new Post1AFormatter();
const post1BFormatter = new Post1BFormatter();
const post1CFormatter = new Post1CFormatter();
const post2Formatter = new Post2Formatter();
const section3Formatter = new Section3Formatter();

const manufactureFormatter = new ManufactureFormatter();
const chickenFarmFormatter = new ChickenFarmFormatter();
const constructionFormatter = new ConstructionFormatter();

const PAGE_SIZE = 1;

class BrowsePostFormatter {
  messages = {
    useButtonError: 'Please use buttons to select',
    selectCategoryMessage: 'Select category...',
    selectWoredaMessage: 'Select woreda...',
    selectSection1BMainCategoryMsg: 'Select main category...',
    selectSection1BSubCategoryMsg: 'Select sub category...',
    selectArBrMessage: 'Select AR/BR...',
    selectLastDigitMessage: 'Select last digit...',
    selectDIRangeMessage: 'Select BR range...',
    selectBirthMaritalMessage: 'Select Birth/Marital...',
    selectCorrAmendMessage: 'Select Correction/Amendment...',
    selectSection2TypeMessage: 'Select type...',
    selectSection4TypeMessage: 'Select type...',
    selectTimeStampMessage: 'Select timeframe...',
    noPostError: 'There are no posts for the selected options. Click /browse to return to the browse post page.',
  };
  returnToBrowsePostButton: TableMarkupKeyboardButtons;

  constructor() {
    this.returnToBrowsePostButton = [
      [
        {
          text: 'Return to browse post',
          cbString: 'returnToBrowsePost',
        },
      ],
    ];
  }

  // Buttons to filter by status
  filterByStatusButtons(status: any) {
    const buttons = [
      { text: 'All', cbString: `filterByStatus_all` },
      { text: 'Open', cbString: `filterByStatus_open` },
      { text: 'Closed', cbString: `filterByStatus_closed` },
    ];

    return buttons.map((button) => ({
      ...button,
      text: `${status === button.cbString.split('_')[1] ? '✅' : ''} ${button.text}`,
    }));
  }

  // Button to display categories for filtering
  filterByCategoryButton(category: string) {
    return [
      {
        text: `Category - ${category || 'All Topics'}`,
        cbString: `filterByCategory`,
      },
    ];
  }

  // List of categories button to filter
  filterByCategoryChooseButtons(category: any) {
    const categories = [
      'all',
      'Section 1A',
      'Section 1B',
      'Section 1C',
      'Section 2',
      'Section 3',
      'Chicken Farm',
      'Manufacture',
      'Construction',
    ];

    return categories.map((cat) => [
      {
        text: `${category === cat ? '✅' : ''} ${cat}`,
        cbString: `filterByCategory_${cat}`,
      },
    ]);
  }

  filterSection1AWithArBr(selected_ar_br?: any) {
    const ar_brOptions = ['AR', 'BR'];

    return ar_brOptions.map((option) => [
      {
        text: `${selected_ar_br === option ? '✅' : ''} ${option}`,
        cbString: `filterSection1AWithARBR_${option}`,
      },
    ]);
  }

  // List of section1b main categories to filter
  filterBySection1BMainCategory(mainCategory: any) {
    // const mainCategories = ['all', 'Main 1', 'Main 2', 'Main 3', 'Main 4', 'Main 5', 'Main 6', 'Main 7', 'Main 8'];

    const mainCategories = [
      {
        displayName: 'all',
        fieldName: 'all',
      },
      {
        displayName: 'Main 1',
        fieldName: 'main_1',
      },
      {
        displayName: 'Main 2',
        fieldName: 'main_2',
      },
      {
        displayName: 'Main 3',
        fieldName: 'main_3',
      },
      {
        displayName: 'Main 4',
        fieldName: 'main_4',
      },
      {
        displayName: 'Main 5',
        fieldName: 'main_5',
      },
      {
        displayName: 'Main 6',
        fieldName: 'main_6',
      },
      {
        displayName: 'Main 7',
        fieldName: 'main_7',
      },
      {
        displayName: 'Main 8',
        fieldName: 'main_8',
      },
      {
        displayName: 'Main 9',
        fieldName: 'main_9',
      },
      {
        displayName: 'Main 10',
        fieldName: 'main_10',
      },
    ];

    return mainCategories.map((cat) => [
      {
        text: `${mainCategory === cat.fieldName ? '✅' : ''} ${cat.displayName}`,
        cbString: `filterBySection1BMainCategory_${cat.fieldName}`,
      },
    ]);

    // return mainCategories.map((cat) => [
    //   {
    //     text: `${mainCategory === cat ? '✅' : ''} ${cat}`,
    //     cbString: `filterBySection1BMainCategory_${cat}`,
    //   },
    // ]);
  }

  filterBySection1BSubCategory(mainCategory: any, selectedSubCategory?: any) {
    let subCategories: any;

    switch (mainCategory) {
      case 'main_1':
        // subCategories = ['#SubA1', '#SubA2', '#SubA3', '#SubA4', '#SubA5', '#SubA6', '#SubA7', '#SubA8'];

        subCategories = [
          {
            displayName: '#SubA1',
            fieldName: '#SubA_1',
          },
          {
            displayName: '#SubA2',
            fieldName: '#SubA_2',
          },
          {
            displayName: '#SubA3',
            fieldName: '#SubA_3',
          },
          {
            displayName: '#SubA4',
            fieldName: '#SubA_4',
          },
          {
            displayName: '#SubA5',
            fieldName: '#SubA_5',
          },
          {
            displayName: '#SubA6',
            fieldName: '#SubA_6',
          },
          {
            displayName: '#SubA7',
            fieldName: '#SubA_7',
          },
          {
            displayName: '#SubA8',
            fieldName: '#SubA_8',
          },
        ];

        break;
      case 'main_2':
        // subCategories = ['#SubB1', '#SubB2', '#SubB3', '#SubB4', '#SubB5', '#SubB6', '#SubB7', '#SubB8', '#SubB9'];
        subCategories = [
          {
            displayName: '#SubB1',
            fieldName: '#SubB_1',
          },
          {
            displayName: '#SubB2',
            fieldName: '#SubB_2',
          },
          {
            displayName: '#SubB3',
            fieldName: '#SubB_3',
          },
          {
            displayName: '#SubB4',
            fieldName: '#SubB_4',
          },
          {
            displayName: '#SubB5',
            fieldName: '#SubB_5',
          },
          {
            displayName: '#SubB6',
            fieldName: '#SubB_6',
          },
          {
            displayName: '#SubB7',
            fieldName: '#SubB_7',
          },
          {
            displayName: '#SubB8',
            fieldName: '#SubB_8',
          },
          {
            displayName: '#SubB9',
            fieldName: '#SubB_9',
          },
        ];
        break;

      case 'main_3':
        // subCategories = ['#SubB1', '#SubB2', '#SubB3', '#SubB4', '#SubB5', '#SubB6', '#SubB7', '#SubB8', '#SubB9'];
        subCategories = [
          {
            displayName: '#SubB1',
            fieldName: '#SubB_1',
          },
          {
            displayName: '#SubB2',
            fieldName: '#SubB_2',
          },
          {
            displayName: '#SubB3',
            fieldName: '#SubB_3',
          },
          {
            displayName: '#SubB4',
            fieldName: '#SubB_4',
          },
          {
            displayName: '#SubB5',
            fieldName: '#SubB_5',
          },
          {
            displayName: '#SubB6',
            fieldName: '#SubB_6',
          },
          {
            displayName: '#SubB7',
            fieldName: '#SubB_7',
          },
          {
            displayName: '#SubB8',
            fieldName: '#SubB_8',
          },
          {
            displayName: '#SubB9',
            fieldName: '#SubB_9',
          },
        ];

        break;
      case 'main_4':
        // subCategories = ['#SubC1', '#SubC2', '#SubC3', '#SubC4', '#SubC5', '#SubC6', '#SubC7', '#SubC8'];
        subCategories = [
          {
            displayName: '#SubC1',
            fieldName: '#SubC_1',
          },
          {
            displayName: '#SubC2',
            fieldName: '#SubC_2',
          },
          {
            displayName: '#SubC3',
            fieldName: '#SubB_3',
          },
          {
            displayName: '#SubC4',
            fieldName: '#SubC_4',
          },
          {
            displayName: '#SubC5',
            fieldName: '#SubC_5',
          },
          {
            displayName: '#SubC6',
            fieldName: '#SubC_6',
          },
          {
            displayName: '#SubC7',
            fieldName: '#SubC_7',
          },
          {
            displayName: '#SubC8',
            fieldName: '#SubC_8',
          },
        ];

        break;
      case 'main_5':
        // subCategories = ['#SubD1', '#SubD2', '#SubD3'];
        subCategories = [
          {
            displayName: '#SubD1',
            fieldName: '#SubD_1',
          },
          {
            displayName: '#SubD2',
            fieldName: '#SubD_2',
          },
          {
            displayName: '#SubD3',
            fieldName: '#SubD_3',
          },
        ];

        break;
      case 'main_6':
        // subCategories = ['#SubE1', '#SubE2', '#SubE3', '#SubE4', '#SubE5', '#SubE6', '#SubE7', '#SubE8', '#SubE9'];

        subCategories = [
          {
            displayName: '#SubE1',
            fieldName: '#SubE_1',
          },
          {
            displayName: '#SubE2',
            fieldName: '#SubE_2',
          },
          {
            displayName: '#SubE3',
            fieldName: '#SubE_3',
          },
          {
            displayName: '#SubE4',
            fieldName: '#SubE_4',
          },
          {
            displayName: '#SubE5',
            fieldName: '#SubE_5',
          },
          {
            displayName: '#SubE6',
            fieldName: '#SubE_6',
          },
          {
            displayName: '#SubE7',
            fieldName: '#SubE_7',
          },
          {
            displayName: '#SubE8',
            fieldName: '#SubE_8',
          },
          {
            displayName: '#SubE9',
            fieldName: '#SubE_9',
          },
        ];

        break;
      case 'main_7':
        // subCategories = ['#SubF1', '#SubF2', '#SubF3', '#SubF4', '#SubF5'];
        subCategories = [
          {
            displayName: '#SubF1',
            fieldName: '#SubF_1',
          },
          {
            displayName: '#SubF2',
            fieldName: '#SubF_2',
          },
          {
            displayName: '#SubF3',
            fieldName: '#SubF_3',
          },
          {
            displayName: '#SubF4',
            fieldName: '#SubF_4',
          },
          {
            displayName: '#SubF5',
            fieldName: '#SubF_5',
          },
        ];
        break;
      case 'main_8':
        // subCategories = ['#SubG1', '#SubG2', '#SubG3', '#SubG4', '#SubG5', '#SubG6', '#SubG7', '#SubG8'];
        subCategories = [
          {
            displayName: '#SubG1',
            fieldName: '#SubG_1',
          },
          {
            displayName: '#SubG2',
            fieldName: '#SubG_2',
          },
          {
            displayName: '#SubG3',
            fieldName: '#SubG_3',
          },
          {
            displayName: '#SubG4',
            fieldName: '#SubG_4',
          },
          {
            displayName: '#SubG5',
            fieldName: '#SubG_5',
          },
          {
            displayName: '#SubG6',
            fieldName: '#SubG_6',
          },
          {
            displayName: '#SubG7',
            fieldName: '#SubG_7',
          },
          {
            displayName: '#SubG8',
            fieldName: '#SubG_8',
          },
        ];
        break;
      case 'main_9':
        // subCategories = ['#SubH1', '#SubH2', '#SubH3'];
        subCategories = [
          {
            displayName: '#SubH1',
            fieldName: '#SubH_1',
          },
          {
            displayName: '#SubH2',
            fieldName: '#SubH_2',
          },
          {
            displayName: '#SubH3',
            fieldName: '#SubH_3',
          },
        ];
        break;
      case 'main_10':
        subCategories = [];

      default:
        subCategories = [];
    }

    console.log(mainCategory, subCategories);

    return subCategories.map((subcat: any) => [
      {
        text: `${selectedSubCategory === subcat.fieldName ? '✅' : ''} ${subcat.fieldName}`,
        cbString: `filterBySection1BSub_${subcat.fieldName}`,
      },
    ]);
  }

  filterSection1CWithArBr(selected_ar_br?: any) {
    const ar_brOptions = ['AR', 'BR'];

    return ar_brOptions.map((option) => [
      {
        text: `${selected_ar_br === option ? '✅' : ''} ${option}`,
        cbString: `filterBySection1AWithArBr${option}`,
      },
    ]);
  }

  filterBySection2Type(selected_corr_amend?: any) {
    const corr_amendOptions = ['Correction', 'Amendment'];

    return corr_amendOptions.map((option) => [
      {
        text: `${selected_corr_amend === option ? '✅' : ''} ${option}`,
        cbString: `filterBySection2_${option}`,
      },
    ]);
  }

  filterBySection3BirthMarital(selected_birth_marital?: any) {
    // const birth_maritalOptions = ['Birth', 'Marital'];
    const birth_maritalOptions = [
      {
        displayName: 'Birth',
        fieldName: 'birth',
      },
      {
        displayName: 'Marital',
        fieldName: 'marital',
      },
    ];

    return birth_maritalOptions.map((option) => [
      {
        text: `${selected_birth_marital === option.fieldName ? '✅' : ''} ${option.displayName}`,
        cbString: `filterBySection3BirthMarital_${option.fieldName}`,
      },
    ]);
  }
  filterBySection4Type(selectedType?: any) {
    const section4Types = ['Manufacture', 'Construction', 'Chicken Farm'];
    return section4Types.map((type) => [
      {
        text: `${selectedType === type ? '✅' : ''} ${type}`,
        cbString: `filterBySection4Type_${type}`,
      },
    ]);
  }

  filterByWoredaOptionsButton(selectedWoreda?: any) {
    const woredas = [
      {
        displayName: 'all',
        fieldName: 'all',
      },
      {
        displayName: 'Woreda 1',
        fieldName: 'woreda_1',
      },
      {
        displayName: 'Woreda 2',
        fieldName: 'woreda_2',
      },
      {
        displayName: 'Woreda 3',
        fieldName: 'woreda_3',
      },
      {
        displayName: 'Woreda 4',
        fieldName: 'woreda_4',
      },
      {
        displayName: 'Woreda 5',
        fieldName: 'woreda_5',
      },
      {
        displayName: 'Woreda 6',
        fieldName: 'woreda_6',
      },
      {
        displayName: 'Woreda 7',
        fieldName: 'woreda_7',
      },
      {
        displayName: 'Woreda 8',
        fieldName: 'woreda_8',
      },
      {
        displayName: 'Woreda 9',
        fieldName: 'woreda_9',
      },
      {
        displayName: 'Woreda 10',
        fieldName: 'woreda_10',
      },
    ];

    return woredas.map((woreda) => [
      {
        text: `${selectedWoreda == woreda.fieldName ? '✅' : ''} ${woreda.displayName}`,
        cbString: `filterByWoreda_${woreda.fieldName}`,
      },
    ]);
  }

  // Button to display timeframes for filtering
  filterByTimeframeButton(timeframe: string) {
    const timeFrameDisplay = {
      all: 'All Time',
      today: 'Today',
      last7: 'Last 7 days',
      last30: 'Last 30 days',
    } as any;

    // let timeFrameToDisplay;
    // switch (timeframe) {
    //   case 'all':
    //     timeFrameToDisplay = 'All Time';
    //   case 'today':
    //     timeFrameToDisplay = 'Today';
    //   case 'last7':
    //     timeFrameToDisplay = 'Last 7 days';
    //   case 'last30':
    //     timeFrameToDisplay = 'Last 30 days';
    //   default:
    //     timeFrameToDisplay = 'All Time';
    // }

    return [
      {
        text: `Timeframe - ${timeFrameDisplay[timeframe] || 'All Time'}`,
        cbString: `filterByTimeframe_${timeframe}`,
      },
    ];
  }

  // List of timeframes button to filter
  filterByTimeframeChooseButtons(timeframe?: any) {
    const timeFrameDisplay = {
      all: 'All Time',
      today: 'Today',
      week: 'Last 7 days',
      month: 'Last 30 days',
    };

    // let timeFrameToDisplay;
    // switch (timeframe) {
    //   case 'all':
    //     timeFrameToDisplay = 'All Time';
    //   case 'today':
    //     timeFrameToDisplay = 'Today';
    //   case 'last7':
    //     timeFrameToDisplay = 'Last 7 days';
    //   case 'last30':
    //     timeFrameToDisplay = 'Last 30 days';
    //   default:
    //     timeFrameToDisplay = 'All Time';
    // }

    // return [
    //   {
    //     text: `a`,
    //     cbString: `a`,
    //   },
    // ];
    return Object.entries(timeFrameDisplay).map(([key, value]) => [
      {
        text: `${timeframe === key ? '✅' : ''} ${value}`,
        cbString: `filterByTimeframe_${key}`,
      },
    ]);
  }

  filterByLastDigit(category: any, selectedBiDi?: any) {
    if (['Section 1A', 'Section 1B', 'Section 1C'].includes(category)) {
      return [
        {
          text: `Last Digit - ${selectedBiDi || 'All'}`,
          cbString: `filterByLastDigit_${selectedBiDi}`,
        },
      ];
    } else return [];
  }

  chooseBiDiOptions(selectedBiDi: any) {
    const biDiOptions = ['bi', 'di'];

    return biDiOptions.map((option) => [
      {
        text: `${selectedBiDi === option ? '✅' : ''} ${option}`,
        cbString: `filterByLastDigitBiDi_${option}`,
      },
    ]);
  }

  filterByLastDigitBiDiDisplay(selectedArBr?: any) {
    return [this.messages.selectLastDigitMessage, InlineKeyboardButtons(this.chooseBiDiOptions(selectedArBr))];
  }

  chooseDiButtons(selectedDi: any) {
    const DiOptions = [
      {
        displayName: '1-50',
        fieldName: 'di-1-50',
      },
      {
        displayName: '51-200',
        fieldName: 'di-51-200',
      },
      {
        displayName: '201-500',
        fieldName: 'di-201-500',
      },
      {
        displayName: '501-1000',
        fieldName: 'di-501-1000',
      },

      {
        displayName: '1001-5000',
        fieldName: 'di-1001-5000',
      },
      {
        displayName: '5001-10,000',
        fieldName: 'di-5001-10000',
      },
      {
        displayName: '10,001-50,000',
        fieldName: 'di-10001-50000',
      },
      {
        displayName: '50,001-100,000',
        fieldName: 'di-50001-100000',
      },
      {
        displayName: '100,001-500,000',
        fieldName: 'di-100001-500000',
      },
      {
        displayName: '500,001-1,000,000',
        fieldName: 'di-500001-1000000',
      },
      {
        displayName: '1,000,001-5,000,000',
        fieldName: 'di-1000001-5000000',
      },
      {
        displayName: '5,000,001-10,000,000',
        fieldName: 'di-5000001-10000000',
      },
      {
        displayName: '10,000,001-15,000,000',
        fieldName: 'di-10000001-15000000',
      },
      {
        displayName: '15,000,001-20,000,000',
        fieldName: 'di-15000001-200000000',
      },
      {
        displayName: '20,000,001-50,000,000',
        fieldName: 'di-20000001-50000000',
      },
      {
        displayName: '30,000,001-50,000,000',
        fieldName: 'di-30000001-50000000',
      },
      {
        displayName: 'Above 50,000,000',
        fieldName: 'di-50000001-*',
      },
    ];

    return DiOptions.map((option) => [
      {
        text: `${selectedDi === option.fieldName ? '✅' : ''} ${option.displayName}`,
        cbString: `filterByLastDigitDI_${option.fieldName}`,
      },
    ]);
  }

  chooseDiButtonsDisplay(selectedBr?: any) {
    return [this.messages.selectArBrMessage, InlineKeyboardButtons(this.chooseDiButtons(selectedBr))];
  }

  filterByCategoryDisplay(category: any) {
    return [this.messages.selectCategoryMessage, InlineKeyboardButtons(this.filterByCategoryChooseButtons(category))];
  }

  filterBySection1AWithArBrDisplay(selected_ar_br?: any) {
    return [this.messages.selectArBrMessage, InlineKeyboardButtons(this.filterSection1AWithArBr(selected_ar_br))];
  }

  filterBySection1BMainCategoryDisplay(mainCategory: any) {
    return [
      this.messages.selectSection1BMainCategoryMsg,
      InlineKeyboardButtons(this.filterBySection1BMainCategory(mainCategory)),
    ];
  }

  filterBySection1BSubCategoryDisplay(mainCategory: any, selectedSubCategory?: any) {
    return [
      this.messages.selectSection1BSubCategoryMsg,
      InlineKeyboardButtons(this.filterBySection1BSubCategory(mainCategory, selectedSubCategory)),
    ];
  }

  filterBySection1CWithArBrDisplay(selected_ar_br?: any) {
    return [this.messages.selectArBrMessage, InlineKeyboardButtons(this.filterSection1CWithArBr(selected_ar_br))];
  }

  filterBySection2TypeDisplay(selected_corr_amend?: any) {
    return [
      this.messages.selectCorrAmendMessage,
      InlineKeyboardButtons(this.filterBySection2Type(selected_corr_amend)),
    ];
  }

  filterBySection3BirthMaritalDisplay(selected_birth_marital?: any) {
    return [
      this.messages.selectBirthMaritalMessage,
      InlineKeyboardButtons(this.filterBySection3BirthMarital(selected_birth_marital)),
    ];
  }

  filterBySection4TypeDisplay(selectedType?: any) {
    return [this.messages.selectSection4TypeMessage, InlineKeyboardButtons(this.filterBySection4Type(selectedType))];
  }

  filterByTimeframeDisplay(timestamp?: any) {
    return [
      this.messages.selectTimeStampMessage,
      InlineKeyboardButtons(this.filterByTimeframeChooseButtons(timestamp)),
    ];
  }

  filterByWoredaButton(category: any, selectedWoreda?: any) {
    if (['Section 1A', 'Section 1B', 'Section 1C'].includes(category)) {
      return [
        {
          text: `Woreda - ${selectedWoreda || 'All'}`,
          cbString: `filterByWoreda_${selectedWoreda}`,
        },
      ];
    } else return [];
  }

  filterByWoredaOptionsDisplay(selectedWoreda?: any) {
    console.log(`oooo ${selectedWoreda}`);
    return [
      this.messages.selectWoredaMessage,
      InlineKeyboardButtons(this.filterByWoredaOptionsButton(selectedWoreda ? selectedWoreda : 'all')),
    ];
  }

  browsePostDisplay(post: any, filter?: any, currentPage?: number, totalPages?: number) {
    return [
      this.getPostsPreview(post),

      {
        ...InlineKeyboardButtons([
          [{ text: 'View Detail', cbString: '', url: `${config.bot_url}?start=postDetail_${post.id}`, isUrl: true }],
          this.filterByStatusButtons(filter?.status || 'all'),
          this.filterByCategoryButton(filter?.category || 'all'),
          this.filterByTimeframeButton(filter?.timeframe || 'all'),

          // display woreda filter optionally
          this.filterByWoredaButton(post.category, filter?.fields?.woreda),

          // display last digit filter optionally
          this.filterByLastDigit(post.category, filter?.fields?.last_digit),

          this.paginationButtons(currentPage as number, totalPages as number),
        ]),
      },

      // this.filterByCategoryChooseButtons(post.category),
      // this.filterByStatusButtons(post.status),
      // this.filterByTimeframeChooseButtons('all'),
    ];
  }

  // paginationButtons(page: number, totalPages: number) {
  //   const buttons = [];

  //   // Add button to go to first page
  //   buttons.push({ text: '<<', cbString: `goToPage_1` });

  //   // Add button to go to previous page
  //   if (page > 1) {
  //     buttons.push({ text: `<${page - 1}`, cbString: `goToPage_${page - 1}` });
  //   }

  //   // Add current page button
  //   buttons.push({ text: `${page}(current)`, cbString: `goToPage_${page}` });

  //   // Add button to go to next page
  //   if (page < totalPages) {
  //     buttons.push({ text: `${page + 1}>`, cbString: `goToPage_${page + 1}` });
  //   }

  //   // Add button to go to last page
  //   buttons.push({ text: `>>${totalPages}`, cbString: `goToPage_${totalPages}` });

  //   return buttons;
  // }
  paginationButtons(page: number, totalPages: number) {
    const buttons = [];
    const currentPage = page;

    // Add buttons for the current page and its immediate neighbors
    const neighborCount = 1;
    let start = Math.max(1, page - neighborCount);
    let end = Math.min(totalPages, page + neighborCount);

    if (start > 1) {
      buttons.push({ text: `${currentPage == 1 ? '1' : '⏮ 1'}`, cbString: `goToPage_1` });
      if (start > 2) {
        // buttons.push({ text: '...', cbString: `goToPage_${start - 1}` });
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push({
        text: `${currentPage === i ? `${i}` : `${currentPage > i ? '◀️ ' : ''}${currentPage < i ? '▶️ ' : ''}${i}`}`,

        cbString: `goToPage_${i}`,
      });
    }

    if (end < totalPages) {
      // if (end < totalPages - 1) {
      //   buttons.push({ text: '...', cbString: `goToPage_${end + 1}` });
      // }
      buttons.push({
        text: `${currentPage == totalPages ? '' : '⏭'} ${totalPages}`,
        cbString: `goToPage_${totalPages}`,
      });
    }

    return buttons;
  }

  getPostsPreview(post: any) {
    console.log(`category : ${post.category}`);
    const sectionName = getSectionName(post.category) as PostCategory;
    switch (post.category) {
      case 'Section 1A':
        return post1AFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 1B':
        return post1BFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 1C':
        return post1CFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section 2': {
        return post2Formatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      }

      case 'Section 3': {
        return section3Formatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created,
          user: post.user,
          ...post[sectionName],
        });
      }

      case 'Chicken Farm':
        return chickenFarmFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section4Manufacture':
        return manufactureFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
      case 'Section4Construction':
        return constructionFormatter.getPreviewData({
          description: post.description,
          status: post.status,
          category: post.category,
          created_at: post.created_at,
          user: post.user,
          ...post[sectionName],
        });
    }

    switch (true) {
      case areEqaul(post.category, 'Section 1A', true): {
        return `#${post.category.replace(/ /g, '_')}\n________________\n\n${post.ar_br.toLocaleUpperCase()}\n\nWoreda: ${post.woreda} \n\nLast digit: ${post.last_digit} ${post.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${post.location} \n\nDescription: ${post.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${post.user.id}">${post.user.display_name != null ? post.user.display_name : 'Anonymous '}</a>\n\nStatus : ${post.status}`;
        ``;
      }
    }
  }

  noPostsFound() {
    return [this.messages.noPostError, InlineKeyboardButtons(this.returnToBrowsePostButton)];
  }
}
export default BrowsePostFormatter;
