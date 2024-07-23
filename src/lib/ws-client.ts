import { env } from "@/env";
import PusherJS from "pusher-js"

export const wsClient = new PusherJS(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  wsHost: "127.0.0.1",
  wsPort: 6001,
  forceTLS: false,
  cluster: "eu",
  disableStats: false,
  enabledTransports: ["ws"],
});
