"use client";
import EmEmoji from "./EmEmoji";
import EmojiMartPicker from "./EmojiMartPicker";
import { Popover } from "antd";

const EmojiPick = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) => {
  return (
    <Popover
      content={
        <EmojiMartPicker
          onEmojiSelect={({ id }: { id: string }) => onChange?.(id)}
        />
      }
      title="选择图标"
      trigger={"click"}
      placement="rightTop"
    >
      <span
        className="relative flex h-10 w-10 shrink-0 grow-0 cursor-pointer items-center justify-center overflow-hidden rounded-[10px] border-[0.5px] border-[#10182814] text-[24px]"
        style={{
          background: "#ffead5",
        }}
      >
        <EmEmoji id={value} key={value} />
      </span>
    </Popover>
  );
};
export default EmojiPick;
