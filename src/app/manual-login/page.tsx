'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { ManualLoginForm } from '@/components/manual-login-form';

function ManualLoginPageContent() {
    return (
        <div className="relative flex h-screen w-full items-center justify-center text-white">
             <Image
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop"
                alt="Person reading in a library"
                fill
                className="object-cover"
                data-ai-hint="person reading"
            />
            <div className="absolute inset-0 bg-black/60" />
            <ManualLoginForm />
        </div>
    );
}

export default function ManualLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ManualLoginPageContent />
        </Suspense>
    );
}
