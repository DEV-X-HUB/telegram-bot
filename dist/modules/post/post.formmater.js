"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const button_1 = require("../../ui/button");
const date_1 = require("../../utils/helpers/date");
const string_1 = require("../../utils/helpers/string");
const section_a_formatter_1 = __importDefault(require("./section-1/section-1a/section-a.formatter"));
const section_b_formatter_1 = __importDefault(require("./section-1/section-1b/section-b.formatter"));
const section1c_formatter_1 = __importDefault(require("./section-1/section-1c/section1c.formatter"));
const manufacture_formatter_1 = __importDefault(require("./section-4/manufacture/manufacture.formatter"));
const chicken_farm_formatter_1 = __importDefault(require("./section-4/chicken-farm/chicken-farm.formatter"));
const construction_formatter_1 = __importDefault(require("./section-4/construction/construction.formatter"));
const section_2_formatter_1 = __importDefault(require("./section-2/section-2.formatter"));
const section_3_formatter_1 = __importDefault(require("./section-3/section-3.formatter"));
const country_list_1 = require("../../utils/helpers/country-list");
const post1AFormatter = new section_a_formatter_1.default();
const post1BFormatter = new section_b_formatter_1.default();
const post1CFormatter = new section1c_formatter_1.default();
const post2Formatter = new section_2_formatter_1.default();
const section3Formatter = new section_3_formatter_1.default();
const manufactureFormatter = new manufacture_formatter_1.default();
const chickenFarmFormatter = new chicken_farm_formatter_1.default();
const constructionFormatter = new construction_formatter_1.default();
class PostFormatter {
    constructor() {
        this.answerOptions = [
            [
                { text: '✏️ Edit', cbString: 'edit_answer' },
                { text: 'cancel', cbString: 'cancel_answer' },
            ],
            [{ text: '✅ Post', cbString: 'post_answer' }],
        ];
        this.messages = {
            noQuestionTitle: '**No post found mathcing your query**',
            noQuestionDesc: 'Click here to ask a post',
            NoQuestionMessageText: 'Click the button below  to ask ',
            allQuestionsMsg: 'Click the button below  to list the posts ',
            useButtonError: 'use buttons to select  ',
            selectCategoryMessage: 'Select category...',
            selectTimeStampMessage: 'Select timeframe...',
            chooseCityPrompt: 'Please choose your city',
        };
        this.nextRoundSeachedPostsPrompDisplay = (round, totalCount, searchString) => {
            const resultPerPage = parseInt(config_1.default.number_of_result || '5');
            return [
                `Showed ${round * resultPerPage} of ${totalCount} `,
                searchString
                    ? (0, button_1.InlineKeyboardButtons)([[{ text: 'Show More', cbString: `searchedPosts_${searchString}_${round + 1}` }]])
                    : (0, button_1.InlineKeyboardButtons)([[{ text: 'Show More', cbString: `showAllPosts_${round + 1}` }]]),
            ];
        };
    }
    // Buttons to filter by status
    filterByStatusButtons(status) {
        const buttons = [
            { text: 'All', cbString: `filterByStatus_all` },
            { text: 'Open', cbString: `filterByStatus_open` },
            { text: 'Closed', cbString: `filterByStatus_closed` },
        ];
        return buttons.map((button) => (Object.assign(Object.assign({}, button), { text: `${status === button.cbString.split('_')[1] ? '✅' : ''} ${button.text}` })));
    }
    // Button to display categories for filtering
    filterByCategoryButton(category) {
        return [
            {
                text: `Category - ${category}`,
                cbString: `filterByCategory`,
            },
        ];
    }
    // List of categories button to filter
    filterByCategoryChooseButtons(category) {
        const categories = [
            'all',
            'Section 1A',
            'Section 1B',
            'Section 1C',
            'Section 2',
            'Section 3',
            'Chicken Farm',
            'Section4Manufacture',
            'Section4Construction',
        ];
        return categories.map((cat) => ({
            text: `${category === cat ? '✅' : ''} ${cat}`,
            cbString: `filterByCategory_${cat}`,
        }));
    }
    // Button to display timeframes for filtering
    filterByTimeframeButton(timeframe) {
        const timeFrameDisplay = {
            all: 'All Time',
            today: 'Today',
            last7: 'Last 7 days',
            last30: 'Last 30 days',
        };
        return [
            {
                text: `Timeframe - ${timeFrameDisplay[timeframe]}`,
                cbString: `filterByTimeframe_${timeframe}`,
            },
        ];
    }
    // List of timeframes button to filter
    filterByTimeframeChooseButtons(timeframe) {
        const timeFrameDisplay = {
            all: 'All Time',
            today: 'Today',
            last7: 'Last 7 days',
            last30: 'Last 30 days',
        };
        return Object.entries(timeFrameDisplay).map(([key, value]) => ({
            text: `${timeframe === key ? '✅' : ''} ${value}`,
            cbString: `filterByTimeframe_${key}`,
        }));
    }
    browsePostDisplay(post) {
        return [
            // 'hello',
            this.getPostsPreview(post),
            (0, button_1.InlineKeyboardButtons)([
                this.filterByStatusButtons('open'),
                this.filterByCategoryButton('All'),
                this.filterByTimeframeButton('all'),
            ]),
            // this.filterByCategoryChooseButtons(post.category),
            // this.filterByStatusButtons(post.status),
            // this.filterByTimeframeChooseButtons('all'),
        ];
    }
    filterByStatusOptionDisplay(status) {
        return [
            `Filter by status`,
            (0, button_1.InlineKeyboardButtons)([
                [
                    { text: `${status == 'all' ? '✅' : ''} All`, cbString: `filterByStatus_all` },
                    { text: `${status == 'open' ? '✅' : ''} Open`, cbString: `filterByStatus_open` },
                    { text: `${status == 'closed' ? '✅' : ''} Closed`, cbString: `filterByStatus_closed` },
                ],
            ]),
        ];
    }
    seachQuestionTopBar(questionsNumber = 0, searchString) {
        return {
            text: `${questionsNumber} Questions: Show All`,
            start_parameter: `searchedPosts_${searchString}_${1}`,
        };
    }
    questionOptionsButtons(questionId, withUrl) {
        if (withUrl)
            return [
                // navigate to the bot and start the bot with the command 'answer'
                { text: `Detail`, url: `${config_1.default.bot_url}?start=postDetail_${questionId}` },
                // { text: `Browse`, url: `${config.bot_url}?start=browse_${questionId}` },
            ];
        else
            return (0, button_1.InlineKeyboardButtons)([
                [
                    { text: 'Browse', cbString: `browse_${questionId}` },
                    { text: 'Subscribe', cbString: `subscribe_${questionId}` },
                ],
            ]);
    }
    formatSearchQuestions(posts) {
        return posts.map((post, index) => ({
            type: 'article',
            id: `${post.id}_${index}`,
            title: post.description,
            input_message_content: {
                message_text: this.getPostsPreview(post),
                parse_mode: 'HTML',
                entities: [
                    {
                        type: 'bold',
                        offset: 0,
                        length: 10,
                    },
                ],
            },
            reply_markup: {
                inline_keyboard: [this.questionOptionsButtons(post.id.toString(), true)],
            },
            description: `Posted ${(0, date_1.formatDateFromIsoString)(post === null || post === void 0 ? void 0 : post.created_at)},  ${(0, string_1.capitalize)(post.status)}`,
        }));
    }
    formatNoQuestionsErrorMessage() {
        return [
            {
                type: 'article',
                id: `_${1111}`,
                title: this.messages.noQuestionTitle,
                description: this.messages.noQuestionDesc,
                input_message_content: {
                    message_text: this.messages.NoQuestionMessageText,
                    parse_mode: 'Markdown',
                    entities: [
                        {
                            type: 'bold',
                            offset: 0,
                            length: 10,
                        },
                    ],
                },
                reply_markup: {
                    inline_keyboard: [
                        // navigate to the bot and start the bot with the command 'answer'
                        { text: `Make a post`, url: `${config_1.default.bot_url}?start` },
                    ],
                },
            },
        ];
    }
    formatSingleQuestion(question, forAnswer) {
        return [
            `#${question.category}\n\n${question.description}\n\nBy: <a href="${config_1.default.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>\n${(0, date_1.formatDateFromIsoString)(question.created_at)}`,
            this.questionOptionsButtons(question.id, !forAnswer),
        ];
    }
    // getFormattedQuestionPreview(question: any) {
    //   switch (true) {
    //     case areEqaul(question.category, 'Section 1A', true): {
    //       return `#${question.category.replace(/ /g, '_')}\n________________\n\n${question.ar_br?.toLocaleUpperCase()}\n\nWoreda: ${question.woreda} \n\nLast digit: ${question.last_digit}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name != null ? question.user.display_name : 'Anonymous '}</a>`;
    //     }
    //   }
    // }
    formatQuestionDetail(post, forAnswer) {
        return [this.getformattedQuestionDetail(post)];
    }
    formatAnswerPreview(answer, sender) {
        return [
            `${answer}\n\n\nBy: <a href="${config_1.default.bot_url}?start=userProfile_${sender.id}">${sender.display_name || 'Anonymous'}</a>\n${(0, date_1.formatDateFromIsoString)(new Date().toISOString())}`,
            (0, button_1.InlineKeyboardButtons)(this.answerOptions),
        ];
    }
    getformattedQuestionDetail(post) {
        const sectionName = (0, string_1.getSectionName)(post.category);
        switch (post.category) {
            case 'Section 1A':
                return post1AFormatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 1B':
                return post1BFormatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 1C':
                return post1CFormatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 2': {
                return post2Formatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            }
            case 'Section 3': {
                return section3Formatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created, user: post.user }, post[sectionName]));
            }
            case 'ChickenFarm':
                return chickenFarmFormatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Manufacture':
                return manufactureFormatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Construction':
                return constructionFormatter.getDetailData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
        }
        switch (true) {
            case (0, string_1.areEqaul)(post.category, 'Section 1A', true): {
                return `#${post.category.replace(/ /g, '_')}\n________________\n\n${post.ar_br.toLocaleUpperCase()}\n\nWoreda: ${post.woreda} \n\nLast digit: ${post.last_digit} ${post.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${post.location} \n\nDescription: ${post.description}\n\nBy: <a href="${config_1.default.bot_url}?start=userProfile_${post.user.id}">${post.user.display_name != null ? post.user.display_name : 'Anonymous '}</a>\n\nStatus : ${post.status}`;
                ``;
            }
        }
    }
    getFormattedQuestionPreview(post) {
        const sectionName = (0, string_1.getSectionName)(post.category);
        switch (post.category) {
            case 'Section 1A':
                return post1AFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 1B':
                return post1BFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 1C':
                return post1CFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 2': {
                return post2Formatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            }
            case 'Section 3': {
                return section3Formatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created, user: post.user }, post[sectionName]));
            }
            case 'Chicken Farm':
                return chickenFarmFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section4Manufacture':
                return manufactureFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section4Construction':
                return constructionFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
        }
    }
    getPostsPreview(post) {
        const sectionName = (0, string_1.getSectionName)(post.category);
        switch (post.category) {
            case 'Section 1A':
                return post1AFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 1B':
                return post1BFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 1C':
                return post1CFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section 2': {
                return post2Formatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            }
            case 'Section 3': {
                return section3Formatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created, user: post.user }, post[sectionName]));
            }
            case 'Chicken Farm':
                return chickenFarmFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section4Manufacture':
                return manufactureFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
            case 'Section4Construction':
                return constructionFormatter.getPreviewData(Object.assign({ description: post.description, status: post.status, category: post.category, created_at: post.created_at, user: post.user }, post[sectionName]));
        }
    }
    // getBrowsePreview(post: any) {
    //   return [
    //     this.getPostsPreview(post),
    //     this.filterByCategoryChooseButtons(post.category),
    //     this.filterByStatusButtons(post.status),
    //     this.filterByTimeframeChooseButtons('all'),
    //   ];
    // }
    // getFormattedPostPreview(post: Post) {
    //   const sectionName = getSectionName(post.category) as PostCategory;
    //   switch (post.category) {
    //     case 'Section 1A':
    //       return post1AFormatter.getPreviewData(post);
    //     case 'Section 1B':
    //       return post1BFormatter.getPreviewData(post);
    //     case 'Section 1C':
    //       return post1CFormatter.getPreviewData(post);
    //     case 'Section 2': {
    //       return post2Formatter.getPreviewData(post);
    //     }
    //     case 'Section 3': {
    //       return section3Formatter.getPreviewData(post);
    //     }
    //     case 'Chicken Farm':
    //       return chickenFarmFormatter.getPreviewData(post);
    //     case 'Section4Manufacture':
    //       return manufactureFormatter.getPreviewData(post);
    //     case 'Section4Construction':
    //       return constructionFormatter.getPreviewData(post);
    //   }
    // }
    // choose city based on the selected country
    chooseCityFormatter(countryCode, currentRound, selectedCity) {
        let cities = [];
        const citiesExtracted = (0, country_list_1.getCitiesOfCountry)(countryCode);
        if (citiesExtracted)
            cities = citiesExtracted;
        const { cityList, lastRound } = (0, country_list_1.iterateCities)(cities, 30, parseInt(currentRound));
        if (cityList)
            return [
                this.messages.chooseCityPrompt,
                (0, button_1.InlineKeyboardButtons)(
                // map the country list to the buttons
                [
                    ...cityList.map((city) => [
                        { text: `${selectedCity === city.name ? '✅ ' : ''}${city.name}`, cbString: city.name },
                    ]),
                    [{ text: 'Other', cbString: 'Other' }],
                    !lastRound ? [{ text: '➡️ Next', cbString: 'next' }] : [],
                    [{ text: '⬅️ Back', cbString: 'back' }],
                ]),
                (0, button_1.InlineKeyboardButtons)(
                // map the country list to the buttons
                [[{ text: 'Other', cbString: 'Other' }]]),
            ];
        return [
            'Unable to find cities',
            (0, button_1.InlineKeyboardButtons)(
            // map the country list to the buttons
            [[{ text: 'Back', cbString: 'back' }], [{ text: 'Other', cbString: 'Other' }]]),
        ];
    }
}
exports.default = PostFormatter;
//# sourceMappingURL=post.formmater.js.map