import SideBarNav from "@/components/common/SideBarNavigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBarNav />
      <div className="flex-1 grow mb-6">{children}</div>
    </div>
  );
}
