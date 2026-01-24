import type { HTMLAttributes } from "react";

export interface EmojiProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  id?: string;
  shortcodes?: string;
  native?: string;
  size?: string | number;
  fallback?: string;
  set?: "native" | "apple" | "facebook" | "google" | "twitter";
  skin?: 1 | 2 | 3 | 4 | 5 | 6;
}

const EmEmoji = ({ id, native, shortcodes, ...rest }: EmojiProps) => {
  if (!id && !native && !shortcodes) {
    return null;
  }

  return (
    <em-emoji
      id={id}
      native={native}
      shortcodes={shortcodes}
      {...rest}
      key={id || native || shortcodes || "em-emoji"}
    />
  );
};

export default EmEmoji;
