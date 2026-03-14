/**
 * @fileoverview This is the home page of the application.
 * It serves as a role selection screen, allowing the user to identify as either an Admin or a Visitor.
 */
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

/**
 * The main component for the role selection page.
 */
export default function RoleSelectionPage() {
  // Next.js hook for programmatic navigation.
  const router = useRouter();

  return (
    <div className="relative flex h-screen w-full items-center justify-center text-white">
      {/* Full-screen background image. */}
      <Image
        src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop"
        alt="Library background"
        fill
        className="object-cover"
        data-ai-hint="library books"
      />
      {/* Dark overlay for better text contrast. */}
      <div className="absolute inset-0 bg-black/60" />
      {/* The main card for role selection. */}
      <Card className="relative w-full max-w-md bg-background/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-foreground [text-shadow:0_0_8px_hsl(var(--accent))]">
            Welcome to NEU Library
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          {/* Admin role selection button. Navigates to the login page with a 'role=admin' query parameter. */}
          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push('/login?role=admin')}
          >
            <Shield className="mr-2 h-5 w-5" />
            Admin
          </Button>
          {/* Visitor role selection button. Navigates to the login page with a 'role=visitor' query parameter. */}
          <Button
            size="lg"
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/10"
            onClick={() => router.push('/login?role=visitor')}
          >
            <User className="mr-2 h-5 w-5" />
            Visitor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
