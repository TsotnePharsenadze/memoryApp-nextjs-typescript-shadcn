import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjectEmpty<T extends object>(obj: T): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
