import AdminShell from "@/components/layout/shell/AdminShell";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}