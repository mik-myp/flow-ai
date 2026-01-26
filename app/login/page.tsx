import { Waypoints } from "lucide-react";
import Link from "next/link";
import SignupForm from "./_components/SignupForm";
// import ThemeSwitch from "@/components/theme/switch";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden h-full flex-col p-10 lg:flex">
        <div className="absolute inset-0 bg-gray-200"></div>
        <div className="relative z-20 flex items-center justify-between text-lg font-medium">
          <Link
            href="/login"
            className="flex items-center gap-2 font-medium text-black"
          >
            <div className="flex size-6 items-center justify-center rounded-md">
              <Waypoints />
            </div>
            Flow AI
          </Link>
          {/* <ThemeSwitch /> */}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
