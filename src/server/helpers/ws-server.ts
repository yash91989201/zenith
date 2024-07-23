import "server-only"
import PusherServer from 'pusher'
// UTILS
import { env } from "@/env"

export const wsServer = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: 'eu',
  useTLS: false,
  port: "6001",
  host: "127.0.0.1",
})
