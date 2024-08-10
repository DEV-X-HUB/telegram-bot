"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = require("../../utils/helpers/chat");
const post_service_1 = __importDefault(require("../post/post.service"));
const browse_post_formatter_1 = __importDefault(require("./browse-post.formatter"));
const country_list_1 = require("../../utils/helpers/country-list");
const restgration_service_1 = __importDefault(require("../registration/restgration.service"));
const browsePostFormatter = new browse_post_formatter_1.default();
const registrationService = new restgration_service_1.default();
const postService = new post_service_1.default();
class BrowsePostController {
    constructor() { }
    displayPost(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            // default state
            ctx.wizard.state.filterBy = {
                category: 'all',
                status: 'all',
                timeframe: 'all',
                fields: {
                    ar_br: 'all',
                    // main_category: 'main_1',
                    main_category: 'all',
                    // sub_category: '#SubA_1',
                    sub_category: 'all',
                    birth_or_marital: 'all',
                    service_type: 'all',
                    city: {
                        cityName: 'all',
                        currentRound: 0,
                    },
                    last_digit: 'all',
                },
            };
            // const posts = await postService.geAlltPosts(1);
            const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
            if (!posts || posts.posts.length == 0) {
                return ctx.reply(browsePostFormatter.messages.noPostError);
            }
            ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                parse_mode: 'HTML',
            });
            return ctx.wizard.next();
        });
    }
    handleFilters(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            // Filter by status
            if (callbackQuery.data.startsWith('filterByStatus')) {
                const status = callbackQuery.data.split('_')[1];
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { status: status });
                // fetch post with status
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                return yield ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
            }
            // Filter by category
            if (callbackQuery.data.startsWith('filterByCategory')) {
                const category = callbackQuery.data.split('_')[1];
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...browsePostFormatter.filterByCategoryDisplay(category));
                return ctx.wizard.next();
            }
            // Filter by timeframe
            if (callbackQuery.data.startsWith('filterByTimeframe')) {
                const timeframeFilter = ctx.callbackQuery.data.split('_')[1];
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...browsePostFormatter.filterByTimeframeDisplay(timeframeFilter));
                return ctx.wizard.selectStep(3);
            }
            // Filter by city
            if (callbackQuery.data.startsWith('filterByCity')) {
                // const cityFilter = `city_${ctx.callbackQuery.data.split('_')[1]}` || 'all';
                const sender = (0, chat_1.findSender)(ctx);
                const userCountry = yield registrationService.getUserCountry(sender.id);
                const countryCode = (0, country_list_1.getCountryCodeByName)(userCountry);
                // const residenceCity = await registrationService.getUserCity(sender.id);
                ctx.wizard.state.filterBy.fields.city = Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields.city), { countryCode: countryCode, 
                    // cityName : 'All',
                    currentRound: 0 });
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...browsePostFormatter.chooseCityFormatter(countryCode, ctx.wizard.state.filterBy.fields.city.currentRound, (_a = ctx.wizard.state.filterBy.fields.city) === null || _a === void 0 ? void 0 : _a.cityName));
                return ctx.wizard.selectStep(11);
            }
            // filter by last digit
            if (callbackQuery.data.startsWith('filterByLastDigit')) {
                const lastDigitFilter = ctx.callbackQuery.data.split('_')[1];
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                yield ctx.reply(...browsePostFormatter.filterByLastDigitBiDiDisplay(lastDigitFilter));
                return ctx.wizard.selectStep(12);
            }
            // Pagination
            if (callbackQuery.data.startsWith('goToPage')) {
                console.log(callbackQuery.data);
                const page = Number(callbackQuery.data.split('_')[1]);
                console.log('qqqqqqqq');
                console.log(page);
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy, page);
                console.log(posts);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                return yield ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, page, posts.total));
            }
        });
    }
    handleFilterByCategory(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterByCategory')) {
                const categoryFilter = ctx.callbackQuery.data.split('_')[1];
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { category: categoryFilter });
                if (categoryFilter === 'all') {
                    // Get posts by the selected category
                    ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { category: categoryFilter });
                    const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                    console.log(posts);
                    if (!posts || posts.posts.length == 0) {
                        return ctx.reply(browsePostFormatter.messages.noPostError);
                    }
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                        parse_mode: 'HTML',
                    });
                    return ctx.wizard.selectStep(1);
                }
                else if (categoryFilter === 'Section 1A') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection1AWithArBrDisplay(categoryFilter));
                    // jump to handler
                    return ctx.wizard.selectStep(4);
                }
                else if (categoryFilter === 'Section 1B') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection1BMainCategoryDisplay(categoryFilter));
                    // jump to handler
                    return ctx.wizard.selectStep(5);
                }
                else if (categoryFilter === 'Section 1C') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection1CWithArBrDisplay(categoryFilter));
                    // jump to handler
                    return ctx.wizard.selectStep(7);
                }
                else if (categoryFilter === 'Section 2') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection1CWithArBrDisplay(categoryFilter));
                    // jump to handler
                    return ctx.wizard.selectStep(8);
                }
                else if (categoryFilter === 'Section 3') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection3BirthMaritalDisplay(categoryFilter));
                    // jump to handler
                    return ctx.wizard.selectStep(9);
                }
                else if (categoryFilter === 'Section 4') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection4TypeDisplay(categoryFilter));
                    // jump to handler
                    return ctx.wizard.selectStep(10);
                }
                else {
                    // Get posts by the selected category
                    ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { category: categoryFilter });
                    const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                    console.log(posts);
                    if (!posts || posts.posts.length == 0) {
                        return ctx.reply(browsePostFormatter.messages.noPostError);
                    }
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                        parse_mode: 'HTML',
                    });
                    return ctx.wizard.selectStep(1);
                }
                // // Get posts by the selected category
                // ctx.wizard.state.filterBy = {
                //   ...ctx.wizard.state.filterBy,
                //   category: categoryFilter,
                // };
                // const posts = await postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                // console.log(posts);
                // if (!posts || posts.posts.length == 0) {
                //   return ctx.reply(browsePostFormatter.messages.noPostError);
                // }
                // await deleteMessageWithCallback(ctx);
                // ctx.replyWithHTML(
                //   ...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total),
                //   {
                //     parse_mode: 'HTML',
                //   },
                // );
                // return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterByTimeframe(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterByTimeframe')) {
                const timeframeFilter = ctx.callbackQuery.data.split('_')[1];
                console.log(timeframeFilter);
                // update the state
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { timeframe: timeframeFilter });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterSection1AWithARBR(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(`cb: ${callbackQuery.data}`);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterSection1AWithARBR')) {
                const section1AWithARBRFilter = ctx.callbackQuery.data.split('_')[1];
                console.log(section1AWithARBRFilter);
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { ar_br: String(section1AWithARBRFilter).toLowerCase() }) });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                console.log(posts);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterBySection1BMain(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterBySection1BMain')) {
                //append the value of main
                const section1BMainFilter = `main_${ctx.callbackQuery.data.split('_')[2]}`;
                console.log(`filterrr ${section1BMainFilter}`);
                if (section1BMainFilter === 'all') {
                    ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { main_category: section1BMainFilter }) });
                    // Get posts by the selected category
                    const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    if (!posts || posts.posts.length == 0) {
                        return ctx.reply(browsePostFormatter.messages.noPostError);
                    }
                    ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                        parse_mode: 'HTML',
                    });
                    return ctx.wizard.selectStep(1);
                }
                else {
                    ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { main_category: section1BMainFilter }) });
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.filterBySection1BSubCategoryDisplay(section1BMainFilter));
                    return ctx.wizard.next();
                }
            }
        });
    }
    handleFilterBySection1BSub(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterBySection1BSub')) {
                // append the second and third array element
                const section1BSubFilter = `${ctx.callbackQuery.data.split('_')[1]}_${ctx.callbackQuery.data.split('_')[2]}`;
                console.log(section1BSubFilter);
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { sub_category: section1BSubFilter }) });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterSection1CWithARBR(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterSection1CWithARBR')) {
                const section1CWithARBRFilter = ctx.callbackQuery.data.split('_')[1];
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { ar_br: String(section1CWithARBRFilter).toLowerCase() }) });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterSection2Type(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterBySection2Type')) {
                const section2TypeFilter = ctx.callbackQuery.data.split('_')[1];
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { service_type: section2TypeFilter }) });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterSection3BirthMarital(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterBySection3BirthMarital')) {
                const section3BirthMaritalFilter = ctx.callbackQuery.data.split('_')[1];
                console.log(`Maritalll: ${section3BirthMaritalFilter}`);
                ctx.wizard.state.filterBy.fields = Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { birth_or_marital: section3BirthMaritalFilter });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterSection4Type(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterBySection4Type')) {
                const section4WithTypeFilter = ctx.callbackQuery.data.split('_')[1];
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { category: section4WithTypeFilter });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterByCity(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            if (!callbackQuery)
                return ctx.reply(browsePostFormatter.messages.useButtonError);
            (0, chat_1.deleteMessageWithCallback)(ctx);
            switch (callbackQuery.data) {
                case 'back': {
                    if (ctx.wizard.state.filterBy.fields.city.currentRound == 0) {
                        return ctx.wizard.selectStep(0);
                    }
                    ctx.wizard.state.filterBy.fields.city.currentRound = ctx.wizard.state.filterBy.fields.city.currentRound - 1;
                    return ctx.reply(...browsePostFormatter.chooseCityFormatter(ctx.wizard.state.filterBy.fields.city.countryCode, ctx.wizard.state.filterBy.fields.city.currentRound));
                }
                case 'next': {
                    ctx.wizard.state.filterBy.fields.city.currentRound = ctx.wizard.state.filterBy.fields.city.currentRound + 1;
                    return ctx.reply(...browsePostFormatter.chooseCityFormatter(ctx.wizard.state.filterBy.fields.city.countryCode, ctx.wizard.state.filterBy.fields.city.currentRound));
                }
                default:
                    ctx.wizard.state.filterBy.fields.city.currentRound = 0;
                    ctx.wizard.state.filterBy.fields.city.cityName = callbackQuery.data;
                    // fetch post with city
                    const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                    if (!posts || posts.posts.length == 0) {
                        return ctx.reply(browsePostFormatter.messages.noPostError);
                    }
                    ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                        parse_mode: 'HTML',
                    });
                    return ctx.wizard.selectStep(1);
            }
        });
    }
    handleFilterByLastDigit(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterByLastDigitBiDi')) {
                const lastDigitFilter = ctx.callbackQuery.data.split('_')[1];
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { last_digit: lastDigitFilter }) });
                if (lastDigitFilter == 'all' || lastDigitFilter == 'bi' || lastDigitFilter == 'di') {
                    yield (0, chat_1.deleteMessageWithCallback)(ctx);
                    yield ctx.reply(...browsePostFormatter.chooseBiDiButtonsDisplay(lastDigitFilter, ctx.wizard.state.filterBy.fields.last_digit));
                    return ctx.wizard.selectStep(13);
                }
            }
        });
    }
    handlefilterByLastDigitBIDI(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbackQuery = ctx.callbackQuery;
            console.log(callbackQuery.data);
            if (!callbackQuery) {
                return ctx.reply(...browsePostFormatter.messages.useButtonError);
            }
            if (callbackQuery.data.startsWith('filterByLastDigitBiDiOptions')) {
                const lastDigitFilter = ctx.callbackQuery.data.split('_')[1];
                console.log('lastDigitFilter');
                ctx.wizard.state.filterBy = Object.assign(Object.assign({}, ctx.wizard.state.filterBy), { fields: Object.assign(Object.assign({}, ctx.wizard.state.filterBy.fields), { last_digit: lastDigitFilter }) });
                // Get posts by the selected category
                const posts = yield postService.getAllPostsWithQuery(ctx.wizard.state.filterBy);
                yield (0, chat_1.deleteMessageWithCallback)(ctx);
                if (!posts || posts.posts.length == 0) {
                    return ctx.reply(browsePostFormatter.messages.noPostError);
                }
                ctx.replyWithHTML(...browsePostFormatter.browsePostDisplay(posts.posts[0], ctx.wizard.state.filterBy, 1, posts.total), {
                    parse_mode: 'HTML',
                });
                return ctx.wizard.selectStep(1);
            }
        });
    }
}
// function generateWoredaDisplayName(woreda: string) {
//   switch (woreda) {
//     case 'woreda_1':
//       return 'Woreda 1';
//     case 'woreda_2':
//       return 'Woreda 2';
//     case 'woreda_3':
//       return 'Woreda 3';
//     case 'woreda_4':
//       return 'Woreda 4';
//     case 'woreda_5':
//       return 'Woreda 5';
//     case 'woreda_6':
//       return 'Woreda 6';
//     case 'woreda_7':
//       return 'Woreda 7';
//     case 'woreda_8':
//       return 'Woreda 8';
//     case 'woreda_9':
//       return 'Woreda 9';
//     case 'woreda_10':
//       return 'Woreda 10';
//     default:
//       return 'all';
//   }
// }
exports.default = BrowsePostController;
//# sourceMappingURL=browse-post.controller.js.map