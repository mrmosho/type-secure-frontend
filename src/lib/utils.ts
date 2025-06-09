import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with conditional logic
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date using the specified locale and options
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Generate absolute URLs for the application
 */
export function absoluteUrl(path: string) {
  return `${process.env.VITE_APP_URL || "http://localhost:5173"}${path}`;
}