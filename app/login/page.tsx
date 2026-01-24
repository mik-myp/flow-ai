import { Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "./_components/SignupForm";
import { ThemeSwitch } from "@/components/theme/switch";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <Waypoints />
            </div>
            Flow AI
          </Link>
          <ThemeSwitch />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/placeholder.svg"
          width={500}
          height={500}
          alt="Image"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
