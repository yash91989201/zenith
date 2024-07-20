import { createId } from "@paralleldrive/cuid2";
// UTILS
import {
  saveFileInBucket,
  getFileFromBucket,
  deleteFileFromBucket,
} from "@/server/helpers/store";
import { env } from "@/env";
import { getFileExtension } from "@/lib/utils";
import { currentUser, streamToBuffer } from "@/server/helpers";
// TYPES
import type { NextRequest } from "next/server";

export async function GET(req: Request) {
  try {
    const fileId = new URL(req.url).searchParams.get("file")
    if (!fileId) throw new Error("File id param is required")

    const agencyLogo = await getFileFromBucket({
      bucketName: "media",
      fileName: fileId
    })

    if (!agencyLogo) throw new Error("no image found")
    const imageBuffer = await streamToBuffer(agencyLogo)

    return new Response(imageBuffer)

  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to get agency logo" }, { status: 400 })
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await currentUser()
    if (!user) throw new Error("Un-authorized: login to perform this task")

    const formData = await req.formData()
    const agencyLogo = formData.get("file") as File
    const agencyLogoArrayBuffer = await agencyLogo.arrayBuffer()

    const fileName = `${createId()}.${getFileExtension(agencyLogo)}`
    const fileUrl = `${env.NEXT_PUBLIC_URL}/api/file/agency-logo?file=${fileName}`

    await saveFileInBucket(
      {
        bucketName: "media",
        fileName,
        file: Buffer.from(agencyLogoArrayBuffer)
      }
    )

    return Response.json({ status: "SUCCESS", message: "Agency logo uploaded successfully", fileUrl }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to upload agency logo" }, { status: 400 })
    }
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user } = await currentUser()
    if (!user) throw new Error("Un-authorized: login to perform this task")

    const formData = await req.formData()
    const file = formData.get("file") as string | null

    if (!file) throw new Error("File is required")

    await deleteFileFromBucket({
      bucketName: "media",
      fileName: file
    })

    return Response.json({ status: "SUCCESS", message: "Agency logo deleted" }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ status: "FAILED", message: error.message }, { status: 400 })
    } else {
      return Response.json({ status: "FAILED", message: "Unable to delete agency logo" }, { status: 400 })
    }
  }
}