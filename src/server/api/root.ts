import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
// ROUTERS
import { laneRouter } from "@/server/api/routers/lane";
import { userRouter } from "@/server/api/routers/user";
import { adminRouter } from "@/server/api/routers/admin";
import { mediaRouter } from "@/server/api/routers/media";
import { agencyRouter } from "@/server/api/routers/agency";
import { pipelineRouter } from "@/server/api/routers/pipeline";
import { subAccountRouter } from "@/server/api/routers/sub-account";
import { notificationRouter } from "@/server/api/routers/notification";
import { funnelRouter } from "@/server/api/routers/funnel";
import { ticketRouter } from "@/server/api/routers/ticket";
import { contactRouter } from "@/server/api/routers/contact";
import { tagRouter } from "@/server/api/routers/tag";
import { stripeRouter } from "@/server/api/routers/stripe";
import { funnelPageRouter } from "@/server/api/routers/funnel-page";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tag: tagRouter,
  lane: laneRouter,
  user: userRouter,
  admin: adminRouter,
  media: mediaRouter,
  funnel: funnelRouter,
  ticket: ticketRouter,
  agency: agencyRouter,
  stripe: stripeRouter,
  contact: contactRouter,
  pipeline: pipelineRouter,
  funnelPage: funnelPageRouter,
  subAccount: subAccountRouter,
  notification: notificationRouter,
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
