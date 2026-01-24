import Picker from "@emoji-mart/react";
import type { ComponentProps } from "react";
import data from "@emoji-mart/data";

export type EmojiMartPickerProps = ComponentProps<typeof Picker>;

const EmojiMartPicker = (props: EmojiMartPickerProps) => {
  return (
    <Picker
      data={data}
      {...props}
      locale="zh"
      searchPosition="none"
      previewPosition="none"
      skinTonePosition="none"
    />
  );
};

export default EmojiMartPicker;
