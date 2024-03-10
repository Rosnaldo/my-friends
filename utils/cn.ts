import { ClassNameValue, twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...input: ClassNameValue[]) {
  return twMerge(clsx(input));
}
