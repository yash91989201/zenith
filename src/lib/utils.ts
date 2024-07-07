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