/**
 * @fileoverview This page handles the first step of the manual visitor entry process,
 * where the user must enter their institutional email address for verification.
 */
'use client';

import Image from 'next/image';
import { VisitorEmailForm } from '@/components/visitor-email-form';

/**
 * The main component for the visitor email entry page.
 */
export default function VisitorEmailEntryPage() {
    return (
        <div className="relative flex h-screen w-full items-center justify-center">
            <Image
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop"
                alt="Library background"
                fill
                className="object-cover"
                data-ai-hint="library books"
            />
            <div className="absolute inset-0 bg-black/60" />
            <VisitorEmailForm />
        </div>
    );
}
