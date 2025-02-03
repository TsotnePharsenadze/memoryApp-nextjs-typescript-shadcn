import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjectEmpty<T extends object>(obj: T): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getTimeTaken(timeA: Date | null, timeB: Date | null): string {
  let time =
    (new Date(timeA ?? "2025-01-08 07:58:23.911").getTime() -
      new Date(timeB ?? "2025-01-08 07:58:23.911").getTime()) /
    1000;

  if (time < 60) {
    return `${Math.floor(time)}s`;
  } else if (time < 3600) {
    return `${Math.floor(time / 60)}m`;
  } else {
    return `${Math.floor(time / 3600)}h`;
  }
}
