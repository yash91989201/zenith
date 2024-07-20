"use client";
import * as Tabs from "@radix-ui/react-tabs";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
import { useToggle } from "@/hooks/use-toggle";
// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Button } from "@ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
// CUSTOM COMPONENTS
import { OAuthAccountList } from "@accountModal/profile-tab/oauth-account-list";
import { ProfileUpdateCard } from "@accountModal/profile-tab/profile-update-card";
import { AddEmailAddressCard } from "@accountModal/profile-tab/add-email-address-card";
import { ConnectOauthDropdown } from "@accountModal/profile-tab/connect-oauth-dropdown";
// ICONS
import { MoreHorizontal, Plus } from "lucide-react";

export function ProfileTab() {
  const { nameInitials, user } = useUser();

  const addEmailCard = useToggle(false);
  const profileUpdateCard = useToggle(false);

  return (
    <Tabs.Content
      className="w-full bg-white p-6 dark:bg-dark-tremor-background-subtle"
      value="profile"
    >
      <h4 className="border-b py-6 pt-0 font-bold dark:border-gray-400 lg:text-lg">
        Profile Details
      </h4>
      <div className="flex items-start border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 shrink-0 text-sm font-medium">Profile</h6>
        {/* user profile */}
        {profileUpdateCard.isOpen ? (
          <ProfileUpdateCard
            username={user?.name}
            nameInitials={nameInitials ?? ""}
            avatarUrl={user?.avatarUrl ?? ""}
            hideCard={profileUpdateCard.close}
          />
        ) : (
          <div className="flex flex-1 items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm font-medium">{user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={profileUpdateCard.open}
            >
              Update profile
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-start border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 shrink-0 text-sm font-medium">Email addresses</h6>
        {/* user profile */}
        <div className="w-full space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {user?.email}
                </span>
                <span className="rounded border p-1 py-0.5 text-xs font-medium text-muted-foreground dark:border-gray-400 dark:text-gray-400">
                  Primary
                </span>
              </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="size-6">
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      Remove email
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {addEmailCard.isOpen ? (
            <AddEmailAddressCard hideCard={addEmailCard.close} />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-primary"
              onClick={addEmailCard.open}
            >
              <Plus className="size-4" />
              <span>Add email address</span>
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 text-sm font-medium">Phone numbers</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-start border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 shrink-0 text-sm font-medium">
          Connected accounts
        </h6>
        {/* user profile */}
        <div className="flex w-full flex-col gap-3">
          <OAuthAccountList />
          <ConnectOauthDropdown />
        </div>
      </div>
    </Tabs.Content>
  );
}
