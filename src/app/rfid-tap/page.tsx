/**
 * @fileoverview This page simulates the RFID tapping process. It shows a pulsating
 * card icon and then redirects the user to the appropriate dashboard based on their role.
 */
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { PulsatingRfidCard } from '@/components/pulsating-rfid-card';

/**
 * The main content of the RFID tap simulation page.
 */
function RfidTapPageContent() {
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
            <PulsatingRfidCard />
        </div>
    );
}

/**
 * The main export for the RFID tap page, wrapped in Suspense.
 */
export default function RfidTapPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RfidTapPageContent />
        </Suspense>
    );
}
