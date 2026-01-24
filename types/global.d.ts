import type { HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "em-emoji": HTMLAttributes<HTMLElement> & {
        id?: string;
        shortcodes?: string;
        native?: string;
        size?: string | number;
        fallback?: string;
        set?: "native" | "apple" | "facebook" | "google" | "twitter";
        skin?: 1 | 2 | 3 | 4 | 5 | 6;
        key?: string;
      };
    }
  }
}

export {};
