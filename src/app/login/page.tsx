'use client';
import { Suspense } from 'react';
import { LoginOptions } from '@/components/login-options';

function LoginPageContent() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white">
      <LoginOptions />
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}
