import { Slot } from "ask-sdk-model";

export type AvailableSlotType =
  | "BookTitle"
  | "AuthorName"
  | "PublishedDate"
  | "Genre";
export type AvailableGenre =
  | "travel"
  | "technology"
  | "romance"
  | "history"
  | "self-help"
  | "biography"
  | "fantasy"
  | "science"
  | "nonfiction"
  | "fiction";

export type Slots = Record<AvailableSlotType, Slot>;

export interface UserInput
  extends Record<AvailableSlotType, string | undefined> {
  Genre: AvailableGenre;
}

// * --- Book stuff
export interface GoogleBooksAPIResponse {
  kind: string;
  totalItems: number;
  items: BookItem[];
}

export interface BookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: BookVolumeInfo;
  saleInfo: BookSaleInfo;
  accessInfo: BookAccessInfo;
}

interface BookVolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: {
    type: string;
    identifier: string;
  }[];
  readingModes: {
    text: boolean;
    image: boolean;
  };
  pageCount: number;
  printType: string;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  maturityRating: string;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

interface BookSaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice: {
    amount: number;
    currencyCode: string;
  };
  retailPrice: {
    amount: number;
    currencyCode: string;
  };
}

interface BookAccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: {
    isAvailable: boolean;
  };
  pdf: {
    isAvailable: boolean;
  };
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}
