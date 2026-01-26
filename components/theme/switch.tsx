"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Dropdown, MenuProps } from "antd";

const items: MenuProps["items"] = [
  {
    key: "light",
    label: "浅色",
  },
  {
    key: "dark",
    label: "暗黑",
  },
  {
    key: "system",
    label: "跟随系统",
  },
];

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        defaultSelectedKeys: [theme || "light"],
        onClick: (info) => {
          setTheme(info.key);
        },
      }}
      placement="bottom"
    >
      <div>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </div>
    </Dropdown>
  );
}
