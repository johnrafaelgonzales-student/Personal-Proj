/**
 * @fileoverview This page is for admins who choose the "Manual Entry" login option.
 * It displays a form for an admin to enter their credentials.
 */
'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { ManualLoginForm } from '@/components/manual-login-form';

/**
 * The content of the manual login page.
 */
function ManualLoginPageContent() {
    return (
        <div className="relative flex h-screen w-full items-center justify-center">
            {/* Background image for the manual login screen. */}
             <Image
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop"
                alt="Library background"
                fill
                className="object-cover"
                data-ai-hint="library books"
            />
            {/* A semi-transparent overlay to darken the background image. */}
            <div className="absolute inset-0 bg-black/60" />
            {/* The form component for manual login. */}
            <ManualLoginForm />
        </div>
    );
}

/**
 * The main export for the manual login page, using Suspense for loading.
 */
export default function ManualLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ManualLoginPageContent />
        </Suspense>
    );
}
