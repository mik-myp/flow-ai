"use client";
import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";

dayjs.locale("zh-cn");
init({ data });
export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <StyleProvider layer>
        <ConfigProvider
          locale={zhCN}
          tooltip={{
            unique: true,
          }}
        >
          <App>{children}</App>
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
}
