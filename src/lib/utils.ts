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