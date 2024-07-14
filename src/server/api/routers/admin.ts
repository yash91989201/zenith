import { eq } from "drizzle-orm";
// DB SCHEMAS
import { InvitationTable, UserTable } from "@/server/db/schema";
// SCHEMAS
import { InviteUserSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { InviteUserType } from "@/lib/types";
import { saveFileInBucket } from "@/server/helpers/store";
import { createId } from "@paralleldrive/cuid2";
import { env } from "@/env";

export const adminRouter = createTRPCRouter({
  inviteUser: protectedProcedure.input(InviteUserSchema).mutation(async ({ ctx, input }): ProcedureStatus<InviteUserType> => {
    try {

      const userExists = await ctx.db.query.UserTable.findFirst({ where: eq(UserTable.email, input.email) })
      if (userExists) throw new Error("User with this email already exists.")

      const profileImageExt = "png"
      // get random profile from dicebear
      const profileRes = await fetch(`https://api.dicebear.com/8.x/avataaars/${profileImageExt}?seed=${input.name}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf&accessories=prescription01,prescription02,round,sunglasses&clothing=blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck,blazerAndShirt&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,upDown,upDownNatural&eyes=default,happy,surprised&facialHair[]&mouth=default,smile&top=bigHair,bun,curly,curvy,dreads,dreads01,dreads02,frida,frizzle,fro,froBand,hat,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,shortCurly,shortFlat,shortRound,shortWaved,sides,straight01,straight02,straightAndStrand,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1`)
      const profileImage = await profileRes.blob();
      const profileImageArrayBuffer = await profileImage.arrayBuffer()

      const fileName = `${createId()}.${profileImageExt}`
      const fileUrl = `${env.NEXT_PUBLIC_URL}/api/file/profile?file=${fileName}`
      await saveFileInBucket(
        {
          bucketName: "profile",
          fileName,
          file: Buffer.from(profileImageArrayBuffer)
        }
      )

      const [createUserQuery] = await ctx.db.insert(UserTable).values({
        ...input,
        avatarUrl: fileUrl,
      })

      if (createUserQuery.affectedRows === 0) throw new Error("Unable to create user")

      const [createUserInvite] = await ctx.db.insert(InvitationTable).values({
        email: input.email,
        agencyId: input.agencyId,
        role: input.role,
      })

      if (createUserInvite.affectedRows === 0) throw new Error("Unable to create user invitation")
      return {
        status: "SUCCESS",
        message: "User invitation sent."
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});
