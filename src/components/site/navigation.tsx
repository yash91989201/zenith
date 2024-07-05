import { ThemeToggle } from "@/components/global/theme-toggle";
// import { UserButton } from "@clerk/nextjs";
// import type { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// type NavigationProps = {
//   user?: User | null;
// };

export function Navigation() {
  return (
    <header className="relative flex items-center justify-between p-4 ">
      <aside className="flex items-center gap-2 ">
        <Image src="/assets/plura-logo.svg" alt="logo" width={48} height={48} />
        <span className="text-xl font-bold">Plura.</span>
      </aside>

      <nav className=" hidden md:block">
        <ul className="flex items-center justify-center gap-6">
          <Link href="#">About</Link>
          <Link href="#">Docs</Link>
          <Link href="#">Features</Link>
          <Link href="#">About</Link>
        </ul>
      </nav>
      <aside className="flex items-center gap-3">
        <Link
          href="/agency/sign-in"
          className="bg-primary hover:bg-primary/80 rounded-md p-2 px-4 text-white transition-all"
        >
          Login
        </Link>
        {/* <UserButton /> */}
        <ThemeToggle />
      </aside>
    </header>
  );
}
