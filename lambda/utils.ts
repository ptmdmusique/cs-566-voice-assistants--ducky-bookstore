import Fuse from "fuse.js";
import { match } from "ts-pattern";
import {
  ERROR_PROMPTS,
  FALLBACK_PROMPTS,
  GOODBYE_PROMPTS,
  GREETING_PROMPTS,
  HELP_PROMPTS,
  MOCK_BOOK_RESPONSE,
  NO_MATCH_PROMPTS,
  NO_SLOT_PROMPTS,
  REPROMPT_PROMPTS,
  RESULT_PROMPTS,
} from "./mock-data";
import {
  AvailableGenre,
  AvailableSlotType,
  BookItem,
  Slots,
  UserInput,
} from "./types";

// * --- Data query
export const queryForData = (userInput: UserInput) => {
  // TODO: replace this with actual query once we start that section
  let results = MOCK_BOOK_RESPONSE.items;

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

const search = (
  slotType: Exclude<AvailableSlotType, "PublishedDate" | "Genre">,
  value: string,
): BookItem[] => {
  const fuse = new Fuse(MOCK_BOOK_RESPONSE.items, {
    keys: [getFuseKeyFromSlotType(slotType)],
    isCaseSensitive: false,
  });

  return fuse.search(value).map(({ item }) => item);
};

const getFuseKeyFromSlotType = (
  slotType: Exclude<AvailableSlotType, "PublishedDate" | "Genre">,
): string => {
  return match(slotType)
    .with("AuthorName", () => "volumeInfo.authors")
    .with("BookTitle", () => "volumeInfo.title")
    .exhaustive();
};

// * --- Helper functions
export const getUserInputFromSlots = (slots: Slots): UserInput => {
  return {
    Genre: slots.Genre.value as AvailableGenre,
    AuthorName: slots.AuthorName.value,
    BookTitle: slots.BookTitle.value,
    PublishedDate: slots.PublishedDate.value,
  };
};

export const getGreetingPrompt = () => {
  return getRandomPrompt(GREETING_PROMPTS);
};

export const getNoSlotPrompt = () => {
  return getRandomPrompt(NO_SLOT_PROMPTS);
};

export const getNoResultPrompt = () => {
  return getRandomPrompt(NO_MATCH_PROMPTS);
};

export const getRepromptPrompts = () => {
  return getRandomPrompt(REPROMPT_PROMPTS);
};

export const getHelpPrompts = () => {
  return getRandomPrompt(HELP_PROMPTS);
};

export const getGoodbyePrompts = () => {
  return getRandomPrompt(GOODBYE_PROMPTS);
};

export const getFallbackPrompts = () => {
  return getRandomPrompt(FALLBACK_PROMPTS);
};

export const getErrorPrompts = () => {
  return getRandomPrompt(ERROR_PROMPTS);
};

export const getResultPrompts = (bookItems: BookItem[]) => {
  const prompt = getRandomPrompt(RESULT_PROMPTS);

  const numResultToReturn = Math.min(bookItems.length, MAX_RESULT_RETURN);
  return prompt
    .replace("{numResults}", bookItems.length.toString())
    .replace("{actualResultToReturn}", numResultToReturn.toString())
    .replace(
      "{results}",
      bookItems.map((item) => item.volumeInfo?.title).join(", "),
    );
};

const MAX_RESULT_RETURN = 5;

const getRandomPrompt = (prompts: string[]) => {
  return prompts[Math.floor(Math.random() * prompts.length)];
};
