/**
 * @fileoverview This page is for users who choose the "Manual Entry" login option.
 * It displays a form for either an admin or a visitor to enter their details.
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
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop"
                alt="Person reading in a library"
                fill
                className="object-cover"
                data-ai-hint="person reading"
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
