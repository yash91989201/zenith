import { toast } from "@ui/use-toast";
import { createGithubAuthUrl, createGoogleAuthUrl } from "@/server/actions/auth";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseZodValidationErrors(validationErrors: Record<string, string[] | undefined>): Record<string, string | undefined> {
  const errors: Record<string, string | undefined> = {};

  for (const key in validationErrors) {
    if (validationErrors[key] && validationErrors[key].length > 0) {
      errors[key] = validationErrors[key][0];
    } else {
      errors[key] = undefined;
    }
  }

  return errors;
}

export async function uploadAvatar(file: File) {

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/file/profile", {
    method: "POST",
    body: formData
  })

  const data = (await response.json()) as SimpleApiResType

  return data
}

export async function uploadAgencyLogo(file: File) {

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/file/agency-logo", {
    method: "POST",
    body: formData,
  },
  )

  const data = (await response.json()) as SimpleApiResType

  return data
}

export const OAuthAccountConnect = {
  google: {
    connect: async () => {
      const res = await createGoogleAuthUrl();
      if (res.status === "success") {
        window.location.href = res.authorizationUrl;
      } else {
        toast({
          variant: "destructive",
          description: res.error,
        });
      }
    },
  },
  github: {
    connect: async () => {
      const res = await createGithubAuthUrl();
      if (res.status === "success") {
        window.location.href = res.authorizationUrl;
      } else {
        toast({
          variant: "destructive",
          description: res.error,
        });
      }
    },
  }
}

export function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }

  bytes = Number(bytes);

  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extracts the file extension from a File object.
 * @param file - The File object to extract the extension from.
 * @returns The file extension as a string.
 */
export function getFileExtension(file: File) {
  const fileName = file.name;
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return ''; // No extension found or hidden file with no extension
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

type ErrorMessages<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
  ? ErrorMessages<U>[] // Handle arrays of nested structures
  : T[K] extends object
  ? ErrorMessages<T[K]> // Handle nested objects
  : string;
};

export class ProcedureError<T> extends Error {
  error: ErrorMessages<T>;

  constructor(message: string, error: ErrorMessages<T>) {
    super(message);
    this.name = 'ProcedureError';
    this.error = error;
    Object.setPrototypeOf(this, ProcedureError.prototype);
  }
}

export async function deleteFileFromStore(fileUrl: string) {
  const file = new URL(fileUrl)
  const fileName = file.searchParams.get("file")
  if (!fileName) return

  const formData = new FormData()
  formData.append("file", fileName)

  const res = await fetch("/api/file/agency-logo", {
    method: "DELETE",
    body: formData
  })

  return res.status === 200
}