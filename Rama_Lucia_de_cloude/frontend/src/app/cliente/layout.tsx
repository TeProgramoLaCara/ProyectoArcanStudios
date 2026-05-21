import ClientShell from "@/components/layout/shell/ClientShell";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ClientShell>{children}</ClientShell>
    </ThemeProvider>
  );
}