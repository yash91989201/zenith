"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
// CUSTOM COMPONENTS
import { ThemeToggle } from "@/components/global/theme-toggle";
import { UserButton } from "@/components/global/user-button";

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
        <UserButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
