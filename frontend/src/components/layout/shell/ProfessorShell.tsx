import ProfessorSidebar from "../sidebar/ProfessorSidebar";

export default function ProfessorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--bg)]">
      <div className="flex h-full">
        <ProfessorSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
