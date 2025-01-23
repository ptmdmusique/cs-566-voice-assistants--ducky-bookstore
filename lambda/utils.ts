import Fuse from "fuse.js";
import { match } from "ts-pattern";
import {
  MOCK_BOOK_RESPONSE,
  NO_MATCH_PROMPTS,
  REPROMPT_PROMPTS,
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

export const getNoResultPrompt = () => {
  return NO_MATCH_PROMPTS[Math.floor(Math.random() * NO_MATCH_PROMPTS.length)];
};

export const getRepromptPrompts = () => {
  return REPROMPT_PROMPTS[Math.floor(Math.random() * REPROMPT_PROMPTS.length)];
};
