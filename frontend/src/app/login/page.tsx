import BackgroundVideo from "@/components/ui/BackgroundVideo";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <BackgroundVideo>
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6">
        <LoginForm />
      </div>
    </BackgroundVideo>
  );
}
