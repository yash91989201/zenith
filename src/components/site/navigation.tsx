import React from "react";
import Link from "next/link";
import Image from "next/image";
// UTILS
import { validateRequest } from "@/lib/auth";
// UI
import { buttonVariants } from "@ui/button";
// CUSTOM COMPONENTS
import { UserButton } from "@/components/global/user-button";
import { ThemeToggle } from "@/components/global/theme-toggle";

export async function Navigation() {
  const { user } = await validateRequest();

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
        {user && (
          <Link
            href="/agency"
            className={buttonVariants({ variant: "outline" })}
          >
            My agency
          </Link>
        )}
        <UserButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
