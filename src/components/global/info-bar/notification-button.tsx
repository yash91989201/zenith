"use client";
import { useMemo, useState } from "react";
// UTILS
import { api } from "@/trpc/react";
import { renderOnClient } from "@/lib/utils";
// TYPES
import type { UserType } from "@/lib/types";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
// UI
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/sheet";
import { Switch } from "@ui/switch";
import { Button } from "@ui/button";
import { Skeleton } from "@ui/skeleton";
import { ScrollArea } from "@ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
// ICONS
import { Bell, Loader2 } from "lucide-react";

type Props = {
  role?: UserType["role"];
  className?: string;
  subAccountId?: string;
};

export const NotificationButton = renderOnClient(
  ({ subAccountId }: Props) => {
    const { user, nameInitials } = useUser();
    const [showAll, setShowAll] = useState(true);
    const [showRead, setShowRead] = useState(false);

    const { mutateAsync: markAllAsRead, isPending: markingAllAsRead } =
      api.notification.markAllAsRead.useMutation();

    const {
      data: notifications = [],
      isLoading: notificationsLoading,
      refetch: refetchNotifications,
    } = api.user.getNotifications.useQuery({
      agencyId: user?.agencyId ?? "",
    });

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

    const handleClick = () => {
      setShowAll((prev) => !prev);
    };

    const markAllAsReadAction = async () => {
      const markAllAsReadRes = await markAllAsRead({
        notificationIds: notifications
          .filter((notification) => !notification.read)
          .map((notification) => notification.id),
      });
      if (markAllAsReadRes.status === "SUCCESS") {
        await refetchNotifications();
      }
    };

    const toggleShowReadNotifications = () => {
      setShowRead((currVal) => !currVal);
    };

    if (notificationsLoading) {
      return <Skeleton className="h-9 w-9 rounded-full" />;
    }

    return (
      <Sheet>
        <SheetTrigger>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Bell className="size-5" />
            {notificationsLoading ? (
              <Skeleton className="size-4" />
            ) : (
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
              {["AGENCY_ADMIN", "AGENCY_OWNER"].includes(user?.role ?? "") && (
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
                    <AvatarImage src={user?.avatarUrl} alt="Profile Picture" />
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
    );
  },
  <Skeleton className="h-9 w-9 rounded-full" />,
);
