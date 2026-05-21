import { ThemeProvider } from "@/context/ThemeContext";
import ProfessorShell from "@/components/layout/shell/ProfessorShell";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ProfessorShell>{children}</ProfessorShell>
    </ThemeProvider>
  );
}