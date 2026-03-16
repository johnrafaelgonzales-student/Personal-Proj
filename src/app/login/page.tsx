/**
 * @fileoverview This file defines the Login page, which presents different login options to the user.
 * It's a client component that uses a background image and a central card for the login choices.
 * This page conditionally renders either the role selection or the login method options based on URL parameters.
 */
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';
import { LoginOptions } from '@/components/login-options';

/**
 * A component that renders the role selection card (Admin vs. Visitor).
 */
function RoleSelection() {
  const router = useRouter();
  return (
    <Card className="relative w-full max-w-md bg-background/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-foreground">
          Continue as...
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please select your role to log in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <Button
          size="lg"
          variant="outline"
          className="w-full border-white text-white hover:bg-black/10"
          onClick={() => router.push('/login?role=admin')}
        >
          <Shield className="mr-2 h-5 w-5" />
          Admin
        </Button>
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push('/login?role=visitor')}
        >
          <User className="mr-2 h-5 w-5" />
          Visitor
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="w-full"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * The main content of the login page. It decides whether to show role selection
 * or login method options based on the 'role' URL query parameter.
 */
function LoginPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

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
      {/* If a role is selected, show login options. Otherwise, show role selection. */}
      {role ? <LoginOptions /> : <RoleSelection />}
    </div>
  );
}

/**
 * The main export for the login page, which uses React Suspense to handle loading states.
 */
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}
