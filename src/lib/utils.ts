import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts Bengali numerals to English numerals.
 */
export function convertBengaliToEnglish(str: string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (d) => bengaliDigits.indexOf(d).toString());
}

/**
 * Normalizes phone numbers for comparison.
 * Converts to English digits, removes non-digits, and handles leading zero.
 */
export function normalizePhone(phone: string | number): string {
  let str = String(phone || '');
  // Convert Bengali to English digits first
  str = convertBengaliToEnglish(str);
  // Remove all non-digits
  const clean = str.replace(/\D/g, '');
  // If it starts with '0', remove it for easier matching
  if (clean.startsWith('0')) return clean.substring(1);
  return clean;
}
