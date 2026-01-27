import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/theme/provider";
import AntdProvider from "@/components/providers/AntdProvider";

export const metadata: Metadata = {
  title: "Flow AI",
  description: "工作流与模型管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AntdProvider>{children}</AntdProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
