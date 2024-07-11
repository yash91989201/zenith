import Link from "next/link";
// UTILS
import { buttonVariants } from "@ui/button";

export function Unauthorized() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-3 p-4 text-center">
      <h1 className="text-3xl md:text-6xl">Unauthorized acccess!</h1>
      <p>Please contact support or your agency owner to get access</p>
      <Link href="/" className={buttonVariants()}>
        Back to home
      </Link>
    </div>
  );
}
