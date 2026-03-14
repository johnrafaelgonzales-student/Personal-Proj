/**
 * @fileoverview This component provides a client-side wrapper for the `next-themes` library.
 * It's necessary because theme switching logic relies on browser APIs (like localStorage)
 * and React context, which are only available on the client.
 */
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

/**
 * A client-side component that wraps the ThemeProvider from `next-themes`.
 * @param {ThemeProviderProps} props - Props passed to the `next-themes` provider.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
