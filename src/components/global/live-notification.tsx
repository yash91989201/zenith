"use client";
import { toast } from "sonner";
import { useCallback, useEffect } from "react";
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

  const handleNotification = useCallback(
    (data: LiveNotificationType) => {
      const { activity, userId } = data;

      if (user?.id !== userId) {
        toast.info(activity, {
          position: "top-center",
        });
      }

      void apiUtils.user.getNotifications.refetch();
    },
    [user?.id, apiUtils.user.getNotifications],
  );

  useEffect(() => {
    const channel = wsClient.subscribe("zenith");
    channel.bind("notification", handleNotification);

    return () => {
      wsClient.unsubscribe("zenith");
      channel.unbind("notification", handleNotification);
    };
  }, [user?.id, handleNotification]);

  return null;
}
