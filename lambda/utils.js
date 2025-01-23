"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResultPrompts = exports.getErrorPrompts = exports.getFallbackPrompts = exports.getGoodbyePrompts = exports.getHelpPrompts = exports.getRepromptPrompts = exports.getNoResultPrompt = exports.getNoSlotPrompt = exports.getGreetingPrompt = exports.getUserInputFromSlots = exports.queryForData = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const ts_pattern_1 = require("ts-pattern");
const mock_data_1 = require("./mock-data");
// * --- Data query
const queryForData = (userInput) => {
    // TODO: replace this with actual query once we start that section
    let results = mock_data_1.MOCK_BOOK_RESPONSE.items;
    if (userInput.Genre) {
        results = results.filter((item) => {
            return item.volumeInfo?.categories?.includes(userInput.Genre);
        });
    }
    if (userInput.AuthorName) {
        results = search("AuthorName", userInput.AuthorName);
    }
    if (userInput.BookTitle) {
        results = search("BookTitle", userInput.BookTitle);
    }
    if (userInput.PublishedDate) {
        // TODO: make this more dynamic to handle case such as "before"
        results = results.filter((item) => {
            return item.volumeInfo?.publishedDate === userInput.PublishedDate;
        });
    }
    return results;
};
exports.queryForData = queryForData;
const search = (slotType, value) => {
    const fuse = new fuse_js_1.default(mock_data_1.MOCK_BOOK_RESPONSE.items, {
        keys: [getFuseKeyFromSlotType(slotType)],
        isCaseSensitive: false,
    });
    return fuse.search(value).map(({ item }) => item);
};
const getFuseKeyFromSlotType = (slotType) => {
    return (0, ts_pattern_1.match)(slotType)
        .with("AuthorName", () => "volumeInfo.authors")
        .with("BookTitle", () => "volumeInfo.title")
        .exhaustive();
};
// * --- Helper functions
const getUserInputFromSlots = (slots) => {
    return {
        Genre: slots.Genre.value,
        AuthorName: slots.AuthorName.value,
        BookTitle: slots.BookTitle.value,
        PublishedDate: slots.PublishedDate.value,
    };
};
exports.getUserInputFromSlots = getUserInputFromSlots;
const getGreetingPrompt = () => {
    return getRandomPrompt(mock_data_1.GREETING_PROMPTS);
};
exports.getGreetingPrompt = getGreetingPrompt;
const getNoSlotPrompt = () => {
    return getRandomPrompt(mock_data_1.NO_SLOT_PROMPTS);
};
exports.getNoSlotPrompt = getNoSlotPrompt;
const getNoResultPrompt = () => {
    return getRandomPrompt(mock_data_1.NO_MATCH_PROMPTS);
};
exports.getNoResultPrompt = getNoResultPrompt;
const getRepromptPrompts = () => {
    return getRandomPrompt(mock_data_1.REPROMPT_PROMPTS);
};
exports.getRepromptPrompts = getRepromptPrompts;
const getHelpPrompts = () => {
    return getRandomPrompt(mock_data_1.HELP_PROMPTS);
};
exports.getHelpPrompts = getHelpPrompts;
const getGoodbyePrompts = () => {
    return getRandomPrompt(mock_data_1.GOODBYE_PROMPTS);
};
exports.getGoodbyePrompts = getGoodbyePrompts;
const getFallbackPrompts = () => {
    return getRandomPrompt(mock_data_1.FALLBACK_PROMPTS);
};
exports.getFallbackPrompts = getFallbackPrompts;
const getErrorPrompts = () => {
    return getRandomPrompt(mock_data_1.ERROR_PROMPTS);
};
exports.getErrorPrompts = getErrorPrompts;
const getResultPrompts = (bookItems) => {
    const prompt = getRandomPrompt(mock_data_1.RESULT_PROMPTS);
    const numResultToReturn = Math.min(bookItems.length, MAX_RESULT_RETURN);
    return prompt
        .replace("{numResults}", bookItems.length.toString())
        .replace("{actualResultToReturn}", numResultToReturn.toString())
        .replace("{results}", bookItems.map((item) => item.volumeInfo?.title).join(", "));
};
exports.getResultPrompts = getResultPrompts;
const MAX_RESULT_RETURN = 5;
const getRandomPrompt = (prompts) => {
    return prompts[Math.floor(Math.random() * prompts.length)];
};
