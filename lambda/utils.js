"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepromptPrompts = exports.getNoResultPrompt = exports.getUserInputFromSlots = exports.queryForData = void 0;
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
const getNoResultPrompt = () => {
    return mock_data_1.NO_MATCH_PROMPTS[Math.floor(Math.random() * mock_data_1.NO_MATCH_PROMPTS.length)];
};
exports.getNoResultPrompt = getNoResultPrompt;
const getRepromptPrompts = () => {
    return mock_data_1.REPROMPT_PROMPTS[Math.floor(Math.random() * mock_data_1.REPROMPT_PROMPTS.length)];
};
exports.getRepromptPrompts = getRepromptPrompts;
