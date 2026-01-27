import SiteHeader from "./_components/SiteHeader";

export default function ProtectLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
      {modal}
    </div>
  );
}
