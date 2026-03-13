'use client';
import { Suspense } from 'react';
import Image from 'next/image';
import { LoginOptions } from '@/components/login-options';

function LoginPageContent() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center text-white">
      <Image
        src="https://images.unsplash.com/photo-1543002588-b9b6b62224c5?q=80&w=2070&auto=format&fit=crop"
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
