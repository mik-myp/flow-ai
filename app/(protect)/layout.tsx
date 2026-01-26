import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import SiteHeader from "./_components/SiteHeader";

export default function ProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="min-h-svh">
      <SiteHeader />
      <Content className="h-full">{children}</Content>
    </Layout>
  );
}
