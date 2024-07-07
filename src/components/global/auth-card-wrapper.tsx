"use client";
import Link from "next/link";
import Image from "next/image";
// UTILS
import {
  createGithubAuthUrl,
  createGoogleAuthUrl,
} from "@/server/actions/auth";
import { buttonVariants } from "@ui/button";
// UI
import { Button } from "@ui/button";
import { toast } from "@ui/use-toast";
import { Separator } from "@ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@ui/card";
// ICONS
import { ArrowRight } from "lucide-react";
// CUSTOM ICONS
import { GithubIcon, GoogleIcon } from "@/components/global/icons";

export function AuthCardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: AuthCardWrapperProps) {
  return (
    <Card className="w-[96vw] border-0 shadow-none md:max-w-[480px]">
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
  const signInAction = async () => {
    const res = await createGoogleAuthUrl();
    if (res.status === "success") {
      window.location.href = res.authorizationUrl;
    } else {
      toast({
        variant: "destructive",
        description: res.error,
      });
    }
  };

  return (
    <Button className="w-full gap-3" variant="outline" onClick={signInAction}>
      <GoogleIcon className="size-5" />
      <span>Sign In with Google</span>
    </Button>
  );
}

export function GithubOAuthSignInButton() {
  const signInAction = async () => {
    const res = await createGithubAuthUrl();
    if (res.status === "success") {
      window.location.href = res.authorizationUrl;
    } else {
      toast({
        variant: "destructive",
        description: res.error,
      });
    }
  };

  return (
    <Button className="w-full gap-3" variant="outline" onClick={signInAction}>
      <GithubIcon className="size-5 dark:rounded-full dark:bg-white" />
      <span>Sign In with Github</span>
    </Button>
  );
}
