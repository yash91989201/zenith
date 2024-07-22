import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import {
  UserAgencyLink,
  UserAgencyLinkSkeleton,
} from "@global/user-agency-link";
import { UserButton } from "@global/user-button";
import { ThemeToggle } from "@global/theme-toggle";

export function Navigation() {
  return (
    <header className="relative flex items-center justify-between p-4 ">
      <div className="flex items-center gap-2 ">
        <Image
          src="/assets/zenith-logo.svg"
          alt="logo"
          width={48}
          height={48}
        />
        <span className="text-xl font-bold">Zenith.</span>
      </div>

      <nav className=" hidden md:block">
        <ul className="flex items-center justify-center gap-6">
          <Link href="#">About</Link>
          <Link href="#">Docs</Link>
          <Link href="#">Features</Link>
          <Link href="#">About</Link>
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        <Suspense fallback={<UserAgencyLinkSkeleton />}>
          <UserAgencyLink />
        </Suspense>
        <UserButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
