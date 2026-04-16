import AdminShell from "@/components/layout/shell/AdminShell";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}