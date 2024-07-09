"use client";
import Image from "next/image";
import Link from "next/link";
// UTILS
import { buttonVariants } from "@ui/button";
import { OAuthAccountConnect } from "@/lib/utils";
// UI
import { Button } from "@ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@ui/card";
import { Separator } from "@ui/separator";
// ICONS
import { ArrowRight } from "lucide-react";
// CUSTOM ICONS
import { GithubIcon, GoogleIcon } from "@icons";

export function AuthCardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: AuthCardWrapperProps) {
  return (
    <Card className="w-[96vw] md:max-w-[480px]">
      <CardHeader className="flex flex-col items-center justify-center gap-y-3">
        <div className="relative aspect-square w-20">
          <Image src="/assets/zenith-logo.svg" alt="team_sync_logo" fill />
        </div>
        <div className="relative bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          <p className="text-xl font-semibold">{headerLabel}</p>
        </div>
        <div className="flex w-full gap-3">
          <GoogleOAuthSignInButton />
          <GithubOAuthSignInButton />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative flex w-full items-center gap-3">
          <Separator className="w-4/5 shrink" />
          <span className="  text-sm font-semibold text-muted-foreground">
            OR
          </span>
          <Separator className="w-4/5 shrink" />
        </div>
        {children}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        {backButtonLabel && backButtonHref && (
          <Link
            href={backButtonHref}
            className={buttonVariants({
              variant: "link",
              size: "sm",
              className: "flex items-center justify-center gap-2",
            })}
          >
            <span>{backButtonLabel}</span>
            <ArrowRight className="size-4" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export function GoogleOAuthSignInButton() {
  return (
    <Button
      className="w-full gap-3"
      variant="outline"
      onClick={OAuthAccountConnect.google.connect}
    >
      <GoogleIcon className="size-5" />
      <span>Sign In with Google</span>
    </Button>
  );
}

export function GithubOAuthSignInButton() {
  return (
    <Button
      className="w-full gap-3"
      variant="outline"
      onClick={OAuthAccountConnect.github.connect}
    >
      <GithubIcon className="size-5 dark:rounded-full dark:bg-white" />
      <span>Sign In with Github</span>
    </Button>
  );
}
