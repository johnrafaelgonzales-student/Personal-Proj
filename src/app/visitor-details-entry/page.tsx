/**
 * @fileoverview This page handles the second step of the manual visitor entry process,
 * where the visitor fills in their personal details.
 */
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { VisitorDetailsForm } from '@/components/visitor-details-form';

/**
 * The content of the visitor details entry page.
 */
function VisitorDetailsEntryPageContent() {
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
            <VisitorDetailsForm />
        </div>
    );
}

/**
 * The main export for the visitor details page, wrapped in Suspense.
 */
export default function VisitorDetailsEntryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitorDetailsEntryPageContent />
    </Suspense>
  )
}
