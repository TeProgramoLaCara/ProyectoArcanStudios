import BackgroundVideo from "@/components/ui/BackgroundVideo";
import Link from "next/link";

export default function Page() {
  return (
    <BackgroundVideo>
      <div className="flex flex-col items-center gap-6 text-center text-white">
        <h1 className="text-3xl font-bold md:text-5xl">
          Arcan Studios Reservations
        </h1>

        <p className="text-white/80">
          Make your reservations now
        </p>

        <Link
          href="/login"
          className="rounded-lg bg-white px-6 py-3 text-black"
        >
          Go to login
        </Link>
      </div>
    </BackgroundVideo>
  );
}