import Link from "next/link";
// UTILS
import { buttonVariants } from "@ui/button";
import { validateRequest } from "@/lib/auth";
// UI
import { Skeleton } from "@ui/skeleton";

export async function UserAgencyLink() {
  const { user } = await validateRequest();
  if (!user) return null;

  return (
    <Link href="/agency" className={buttonVariants({ variant: "outline" })}>
      My agency
    </Link>
  );
}

export function UserAgencyLinkSkeleton() {
  return <Skeleton className="h-9 w-28" />;
}
