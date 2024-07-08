import "server-only"
import * as Minio from 'minio'
// UTILS
import { env } from '@/env'
// TYPES
import type internal from 'stream'
import type { S3_BUCKETS } from "@/lib/types"

// Create a new Minio client with the S3 endpoint, access key, and secret key
export const s3Client = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: Number(env.S3_PORT),
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  useSSL: env.NODE_ENV === "production",
})

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await s3Client.bucketExists(bucketName)
  if (!bucketExists) {
    await s3Client.makeBucket(bucketName)
  }
}

/**
 * Get file from S3 bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @returns file from S3
 */
export async function getFileFromBucket({ bucketName, fileName }: { bucketName: S3_BUCKETS; fileName: string }) {
  try {
    await s3Client.statObject(bucketName, fileName)
  } catch (error) {
    return null
  }

  return await s3Client.getObject(bucketName, fileName)
}

/**
 * Save file in S3 bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @param file file to save
 */
export async function saveFileInBucket({
  bucketName,
  fileName,
  file,
}: {
  bucketName: S3_BUCKETS
  fileName: string
  file: Buffer | internal.Readable
}) {
  // Create bucket if it doesn't exist
  await createBucketIfNotExists(bucketName)

  // check if file exists - optional.
  // Without this check, the file will be overwritten if it exists
  const fileExists = await checkFileExistsInBucket({
    bucketName,
    fileName,
  })

  if (fileExists) {
    throw new Error('File already exists')
  }

  // Upload image to S3 bucket
  await s3Client.putObject(bucketName, fileName, file)
}

/**
 * Check if file exists in bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @returns true if file exists, false if not
 */
export async function checkFileExistsInBucket({ bucketName, fileName }: { bucketName: string; fileName: string }) {
  try {
    await s3Client.statObject(bucketName, fileName)
  } catch (error) {
    return false
  }
  return true
}