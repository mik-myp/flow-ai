"use client";
import { theme } from "antd";
import { Header } from "antd/es/layout/layout";
import menus from "../_lib/menus";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SiteHeader() {
  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();

  const pathname = usePathname();

  return (
    <Header
      style={{
        background: colorBgContainer,
        borderBottom: `1px solid ${colorBorder}`,
      }}
      className="flex items-center justify-center gap-4"
    >
      <div className="flex h-8 flex-row items-center justify-center gap-4">
        {menus.map((item) => {
          return (
            <div
              key={item.url}
              className={clsx(
                "flex h-full items-center rounded-xl px-3 text-base text-[#475569]",
                pathname === item.url && "text-(--ant-color-primary)!",
                pathname !== item.url && "hover:bg-[#f5f5f5]",
              )}
            >
              <Link
                href={item.url}
                className="flex flex-row items-center gap-2 text-inherit!"
              >
                <div>{item.icon && <item.icon />}</div>
                <div>{item.title}</div>
              </Link>
            </div>
          );
        })}
      </div>
    </Header>
  );
}
