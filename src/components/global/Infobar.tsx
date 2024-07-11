"use client";
import { useMemo, useState } from "react";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { NotificationType, UserType } from "@/lib/types";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
// UI
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetDescription,
} from "@ui/sheet";
import { Button } from "@ui/button";
import { Switch } from "@ui/switch";
import { ScrollArea } from "@ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
// CUSTOM COMPONENTS
import { UserButton } from "@global/user-button";
import { ThemeToggle } from "@global/theme-toggle";
// ICONS
import { Bell, Loader2 } from "lucide-react";

type Props = {
  notifications: NotificationType[];
  role?: UserType["role"];
  className?: string;
  subAccountId?: string;
};

const InfoBar = ({ notifications, subAccountId, className }: Props) => {
  const { user, nameInitials } = useUser();
  const [showAll, setShowAll] = useState(true);
  const [showRead, setShowRead] = useState(false);

  const { mutateAsync: markAllAsRead, isPending: markingAllAsRead } =
    api.notification.markAllAsRead.useMutation();

  const filteredNotifications = useMemo(() => {
    const currentNotifications = showAll
      ? notifications
      : notifications?.filter((item) => item.subAccountId === subAccountId);

    return (
      currentNotifications.filter(
        (notification) => notification.read === showRead,
      ) ?? []
    );
  }, [showAll, notifications, subAccountId, showRead]);

  const notificationIds = useMemo(() => {
    const currentNotifications = showAll
      ? notifications
      : notifications?.filter((item) => item.subAccountId === subAccountId) ??
        [];
    return currentNotifications.map((notification) => notification.id);
  }, [showAll, notifications, subAccountId]);

  const handleClick = () => {
    setShowAll((prev) => !prev);
  };

  const markAllAsReadAction = async () => {
    await markAllAsRead({ notificationIds });
  };

  const toggleShowReadNotifications = () => {
    setShowRead((currVal) => !currVal);
  };

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-20 flex items-center gap-4 border-b-[1px] bg-background/80 p-4 backdrop-blur-md md:left-[300px] ",
        className,
      )}
    >
      <div className="ml-auto flex items-center gap-3">
        <UserButton />
        <Sheet>
          <SheetTrigger>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
              <Bell className="size-5" />
              {filteredNotifications.length > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {filteredNotifications.length}
                </span>
              )}
            </div>
          </SheetTrigger>
          <SheetContent className="mr-3 mt-3 flex h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-lg">
            <SheetHeader className="text-left">
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                {["AGENCY_ADMIN", "AGENCY_OWNER"].includes(
                  user?.role ?? "",
                ) && (
                  <span className=" flex items-center justify-between rounded-xl border bg-card p-4 text-card-foreground shadow">
                    Current Subaccount
                    <Switch onCheckedChange={handleClick} />
                  </span>
                )}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 space-y-1.5">
              {filteredNotifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="my-3 flex flex-col gap-3 text-ellipsis"
                >
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user?.avatarUrl}
                        alt="Profile Picture"
                      />
                      <AvatarFallback className="bg-primary">
                        {nameInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1.5">
                      <p>
                        <span className="font-bold">
                          {notification.text.split("|")[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {notification.text.split("|")[1]}
                        </span>
                        <span className="font-bold">
                          {notification.text.split("|")[2]}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {filteredNotifications?.length === 0 && (
                <div className="my-6 flex items-center justify-center text-muted-foreground">
                  {showAll
                    ? "You have no notifications"
                    : "You have no notifications in subaccount"}
                </div>
              )}
            </ScrollArea>
            <div className="flex flex-col items-center gap-1.5">
              {notifications.length > 0 && (
                <Button
                  className="w-full gap-3"
                  variant={!showRead ? "outline" : "secondary"}
                  onClick={toggleShowReadNotifications}
                >
                  <span>
                    {showRead
                      ? "Show unread notifications"
                      : "Show read notifications"}
                  </span>
                </Button>
              )}

              {filteredNotifications.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full gap-3"
                  disabled={markingAllAsRead}
                  onClick={markAllAsReadAction}
                >
                  {markingAllAsRead && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  <span>Mark all as read</span>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default InfoBar;
