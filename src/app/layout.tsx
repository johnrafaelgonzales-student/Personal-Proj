/**
 * @fileoverview This file defines the root layout for the entire application.
 * It wraps all pages with essential providers like the ThemeProvider for light/dark mode,
 * includes global stylesheets, and sets up the primary HTML structure.
 */
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

// Metadata for the application, used for SEO and browser tab information.
export const metadata: Metadata = {
  title: 'LibFlow',
  description: 'Library Visitor Management System',
};

/**
 * The root layout component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for performance. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Import the 'Inter' font from Google Fonts. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          'Inter'
        )}
      >
        {/* ThemeProvider handles the application's light/dark/system theme. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Renders the active page component. */}
          {children}
          {/* Toaster is for displaying notifications (toasts) across the app. */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
