import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
// UTILS
import { userRouter } from "@/server/api/routers/user";
import { adminRouter } from "@/server/api/routers/admin";
import { mediaRouter } from "@/server/api/routers/media";
import { agencyRouter } from "@/server/api/routers/agency";
import { subAccountRouter } from "@/server/api/routers/sub-account";
import { notificationRouter } from "@/server/api/routers/notification";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  agency: agencyRouter,
  subAccount: subAccountRouter,
  notification: notificationRouter,
  admin: adminRouter,
  media: mediaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
