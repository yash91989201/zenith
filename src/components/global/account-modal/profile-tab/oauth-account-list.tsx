"use client";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { OAuthAccountType } from "@/lib/types";
// CUSTOM HOOKS
import { useOAuthAccounts } from "@/hooks/use-oauth-accounts";

// UI
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
// ICONS
import { Dot, MoreHorizontal } from "lucide-react";
import { CustomIcons } from "@icons";

export function OAuthAccountList() {
  const { oAuthAccounts } = useOAuthAccounts();

  if (oAuthAccounts?.length === 0) return null;

  return oAuthAccounts?.map((oAuthAccount) => (
    <OAuthAccountRow key={oAuthAccount.id} oAuthAccount={oAuthAccount} />
  ));
}

export const OAuthAccountRow = ({
  oAuthAccount,
}: {
  oAuthAccount: OAuthAccountType;
}) => {
  const apiUtils = api.useUtils();

  const { mutateAsync: deleteOAuthAccount } =
    api.user.deleteOAuthAccount.useMutation();

  const revokeOAuthAccess = async () => {
    const revokeAccessRes = await deleteOAuthAccount({
      provider: oAuthAccount.provider,
    });
    if (revokeAccessRes.status === "SUCCESS") {
      await apiUtils.user.getOAuthAccounts.invalidate();
    }
  };

  return (
    <div className="flex items-center justify-between " key={oAuthAccount.id}>
      <p className="inline-flex items-center text-muted-foreground dark:text-gray-200">
        {CustomIcons[oAuthAccount.provider]}
        <span className="ml-1.5 text-xs capitalize">
          {oAuthAccount.provider}
        </span>
        <Dot className="size-7" />
        <span className="text-xs">{oAuthAccount.username}</span>
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="size-6">
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={revokeOAuthAccess}
            >
              Remove
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
