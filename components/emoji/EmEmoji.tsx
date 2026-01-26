"use client";

import { useEffect, useState, type HTMLAttributes } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || (!id && !native && !shortcodes)) {
    return null;
  }

  return (
    <em-emoji
      id={id}
      native={native}
      shortcodes={shortcodes}
      {...rest}
      key={id || native || shortcodes || "em-emoji"}
      suppressHydrationWarning
    />
  );
};

export default EmEmoji;
