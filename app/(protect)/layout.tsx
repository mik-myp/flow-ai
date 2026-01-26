import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import SiteHeader from "./_components/SiteHeader";

export default function ProtectLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <Layout className="min-h-svh">
      <SiteHeader />
      <Content className="h-full">{children}</Content>
      {modal}
    </Layout>
  );
}
