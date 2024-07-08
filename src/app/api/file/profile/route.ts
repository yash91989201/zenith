import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
// SCHEMAS
import { UserTable } from "@/server/db/schema";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { currentUser, streamToBuffer } from "@/server/helpers";
import { getFileFromBucket, saveFileInBucket } from "@/server/helpers/store";
// TYPES
import type { NextRequest } from "next/server";

export async function GET(req: Request) {
  console.log(req.url)
  try {
    const fileId = new URL(req.url).searchParams.get("fileId")
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

export async function POST(req: NextRequest,) {
  try {
    const { user } = await currentUser()
    if (!user) throw new Error("Un-authorized: login to perform this task")

    const formData = await req.formData()
    const profileImage = formData.get("file") as File
    const profileImageArrayBuffer = await profileImage.arrayBuffer()

    const fileId = createId()
    await saveFileInBucket(
      {
        bucketName: "profile",
        fileName: fileId,
        file: Buffer.from(profileImageArrayBuffer)
      }
    )

    const [updateUserProfileQuery] = await db.update(UserTable).set({
      avatarUrl: `${env.NEXT_PUBLIC_URL}/api/file/profile?fileId=${fileId}`
    }).where(eq(UserTable.id, user.id))

    if (updateUserProfileQuery.affectedRows === 0) {
      throw new Error("Unable to upload profile image")
    }

    return Response.json({ status: "SUCCESS", message: "profile image uploaded successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to upload profile image" }, { status: 400 })
    }
  }
}