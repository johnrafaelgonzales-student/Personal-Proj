/**
 * @fileoverview This file defines the Login page, which presents different login options to the user.
 * It's a client component that uses a background image and a central card for the login choices.
 */
'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { LoginOptions } from '@/components/login-options';

/**
 * The main content of the login page, wrapped in Suspense for potential future async operations.
 */
function LoginPageContent() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center text-white">
      {/* Background image for the login screen. */}
      <Image
        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop"
        alt="Library background"
        fill
        className="object-cover"
        data-ai-hint="library books"
      />
      {/* A semi-transparent overlay to darken the background image, improving text readability. */}
      <div className="absolute inset-0 bg-black/60" />
      {/* The component that renders the actual login buttons (e.g., RFID, Manual). */}
      <LoginOptions />
    </div>
  );
}

/**
 * The main export for the login page, which uses React Suspense to handle loading states.
 */
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}
