"use client";
// UTILS
import { OAuthAccountConnect } from "@/lib/utils";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
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
import { Plus } from "lucide-react";
import { CustomIcons } from "@/components/global/icons";
// CONSTANTS
import { OAUTH_ACCOUNT_OPTIONS } from "@/constants";

export function ConnectOauthDropdown() {
  const addEmailCard = useToggle(false);
  const { oAuthAccounts } = useOAuthAccounts();

  const unlinkedOAuthAccounts = OAUTH_ACCOUNT_OPTIONS.filter(
    (account) => !oAuthAccounts?.map((acc) => acc.provider)?.includes(account),
  );

  return unlinkedOAuthAccounts.length > 0 ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-primary"
          onClick={addEmailCard.show}
        >
          <Plus className="size-4" />
          <span>Connect account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        {unlinkedOAuthAccounts.map((account) => (
          <DropdownMenuItem
            key={account}
            onClick={OAuthAccountConnect[account].connect}
            className="gap-1.5 capitalize"
          >
            {CustomIcons[account]}
            <span>{account}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}
