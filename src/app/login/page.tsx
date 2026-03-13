'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { LoginOptions } from '@/components/login-options';

function LoginPageContent() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center text-white">
      <Image
        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop"
        alt="Library background"
        fill
        className="object-cover"
        data-ai-hint="library books"
      />
      <div className="absolute inset-0 bg-black/60" />
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
