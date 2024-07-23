"use client";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
// UTILS
import { api } from "@/trpc/react";
import { wsClient } from "@/lib/ws-client";
import { useUser } from "@/hooks/use-user";

type LiveNotificationType = {
  activity: string;
  userId: string;
};

export function LiveNotification() {
  const { user } = useUser();
  const apiUtils = api.useUtils();
  const [notifications, setNotifications] = useState<LiveNotificationType[]>(
    [],
  );

  const handleNotification = useCallback((data: LiveNotificationType) => {
    setNotifications([data]);
  }, []);

  useEffect(() => {
    const channel = wsClient.subscribe("zenith");
    channel.bind("notification", handleNotification);

    return () => {
      wsClient.unsubscribe("zenith");
      channel.unbind("notification", handleNotification);
    };
  }, [user?.id, handleNotification]);

  useEffect(() => {
    console.log(notifications);
    if (notifications.length === 0) return;

    const latestNotification = notifications[notifications.length - 1];
    if (!latestNotification) return;

    const { activity, userId } = latestNotification;

    if (user?.id !== userId) {
      toast.info(activity, {
        position: "top-center",
      });
    }

    void apiUtils.user.getNotifications.refetch();
  }, [notifications, user?.id, apiUtils.user.getNotifications]);

  return null;
}
