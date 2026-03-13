'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white">
      <Card className="w-full max-w-md border-white/20 bg-accent/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold [text-shadow:0_0_8px_hsl(var(--accent))]">
            Welcome to NEU Library
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push('/login?role=admin')}
          >
            <Shield className="mr-2 h-5 w-5" />
            Admin
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-primary text-primary-foreground hover:bg-primary/10"
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
