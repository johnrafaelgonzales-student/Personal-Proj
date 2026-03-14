/**
 * @fileoverview This file contains utility functions used throughout the application.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function that merges Tailwind CSS classes with clsx for conditional class names.
 * It intelligently handles conflicting classes, ensuring a clean and predictable output.
 * @param {...ClassValue[]} inputs - A list of class names or conditional class objects.
 * @returns {string} The merged and optimized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
