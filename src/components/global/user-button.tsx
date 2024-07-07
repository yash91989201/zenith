"use client";
import Link from "next/link";
// UTILS
import { buttonVariants } from "@ui/button";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/hooks/use-auth";
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
// ICONS
import { LogOut, Settings } from "lucide-react";

type UserButtonProps = {
  signedOutFallback?: "SignInButton" | "Empty";
};

export function UserButton({
  signedOutFallback = "SignInButton",
}: UserButtonProps) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  if (isSignedIn) {
    const nameInitials = user?.name
      .split(" ")
      .filter((nameChunk) => nameChunk.charAt(0))
      .slice(0, 2)
      .join("");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-80">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-3">
            <Avatar className="size-9 self-start">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="h-12 gap-3 text-sm">
            <Settings className="size-4" />
            <span>Manage Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="h-12 gap-3 text-sm" onClick={signOut}>
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (signedOutFallback === "SignInButton") {
    return (
      <Link href="/agency/sign-in" className={buttonVariants()}>
        Sign In
      </Link>
    );
  }
  return null;
}