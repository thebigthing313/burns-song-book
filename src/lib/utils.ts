import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeNameKey(name: string) {
  if (!name || name.length === 0) return '#';
  const first = name[0].toUpperCase();
  // Check A-Z
  if (first >= 'A' && first <= 'Z') return first;
  return '#';
}
