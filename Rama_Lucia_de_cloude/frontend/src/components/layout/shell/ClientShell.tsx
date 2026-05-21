import ClientSidebar from "../sidebar/ClientSidebar";
import Topbar from "../topbar/Topbar";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--bg)]">
      <div className="flex h-full">
        <ClientSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
