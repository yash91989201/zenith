import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
// SCHEMAS
import { UserTable } from "@/server/db/schema";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { getFileExtension } from "@/lib/utils";
import { currentUser, streamToBuffer } from "@/server/helpers";
import { deleteFileFromBucket, getFileFromBucket, saveFileInBucket } from "@/server/helpers/store";
// TYPES
import type { NextRequest } from "next/server";

export async function GET(req: Request) {
  try {
    const fileId = new URL(req.url).searchParams.get("file")
    if (!fileId) throw new Error("File id param is required")

    const profileImage = await getFileFromBucket({
      bucketName: "profile",
      fileName: fileId
    })

    if (!profileImage) throw new Error("no image found")

    const imageBuffer = await streamToBuffer(profileImage)
    return new Response(imageBuffer)

  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to get profile image" }, { status: 400 })
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await currentUser()
    if (!user) throw new Error("Un-authorized: login to perform this task")

    const formData = await req.formData()
    const profileImage = formData.get("file") as File
    const userId = formData.get("userId") as string | null
    const profileImageArrayBuffer = await profileImage.arrayBuffer()

    const fileName = `${createId()}.${getFileExtension(profileImage)}`
    const fileUrl = `${env.NEXT_PUBLIC_URL}/api/file/profile?file=${fileName}`
    await saveFileInBucket(
      {
        bucketName: "profile",
        fileName,
        file: Buffer.from(profileImageArrayBuffer)
      }
    )

    const [updateUserProfileQuery] = await db.update(UserTable).set({
      avatarUrl: fileUrl,
    }).where(eq(UserTable.id, userId ?? user.id))

    if (updateUserProfileQuery.affectedRows === 0) {
      throw new Error("Unable to upload profile image")
    }

    return Response.json({ status: "SUCCESS", message: "profile image uploaded successfully", fileUrl }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to upload profile image" }, { status: 400 })
    }
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user } = await currentUser()
    if (!user) throw new Error("Un-authorized: login to perform this task")

    const formData = await req.formData()
    const file = formData.get("file") as string | null
    const userId = formData.get("userId") as string | null

    if (!file) throw new Error("File is required")

    await deleteFileFromBucket({
      bucketName: "profile",
      fileName: file
    })

    const profileImageExt = "png"
    // get random profile from dicebear
    const profileRes = await fetch(`https://api.dicebear.com/8.x/avataaars/${profileImageExt}?seed=${user.name}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf&accessories=prescription01,prescription02,round,sunglasses&clothing=blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck,blazerAndShirt&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,upDown,upDownNatural&eyes=default,happy,surprised&facialHair[]&mouth=default,smile&top=bigHair,bun,curly,curvy,dreads,dreads01,dreads02,frida,frizzle,fro,froBand,hat,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,shortCurly,shortFlat,shortRound,shortWaved,sides,straight01,straight02,straightAndStrand,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1`)
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

    await db.update(UserTable).set({
      avatarUrl: fileUrl
    })
      .where(eq(UserTable.id, userId ?? user.id))

    return Response.json({ status: "SUCCESS", message: "Avatar image deleted", fileUrl }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to avatar image" }, { status: 400 })
    }
  }
}