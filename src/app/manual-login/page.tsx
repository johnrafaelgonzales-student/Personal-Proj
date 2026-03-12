'use client';
import { Suspense } from 'react';
import { ManualLoginForm } from '@/components/manual-login-form';

function ManualLoginPageContent() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white">
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
