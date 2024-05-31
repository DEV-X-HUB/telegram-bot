export type UrlButtonOptions = {
  buttonText: string;
  url: string;
  hidable?: boolean;
};

// inline button Options
export type InlineKeyboardButton = {
  text: string;
  cbString: string; // callback string
  hidebale?: boolean;
  url?: string;
  isUrl?: boolean;
};

// markup button options
export type RowInlineKeyboardButtons = InlineKeyboardButton[];
export type TableInlineKeyboardButtons = RowInlineKeyboardButtons[];

export type MarkupKeyboardButton = {
  text: string;
  cbString: string; // callback string
  hidebale?: boolean;
  url?: string;
  isUrl?: boolean;
};
export type RowMarkupKeyboardButtons = MarkupKeyboardButton[];
export type TableMarkupKeyboardButtons = RowMarkupKeyboardButtons[];
