"use client";
import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

dayjs.locale("zh-cn");
init({ data });
export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1分钟
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
