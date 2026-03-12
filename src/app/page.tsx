'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-white p-4">
      <Card className="w-full max-w-lg text-center shadow-2xl bg-accent text-accent-foreground">
        <CardHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpenCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="pt-4 text-3xl font-bold">
            Welcome to LibFlow
          </CardTitle>
          <CardDescription className="text-md !mt-2 text-muted-foreground">
            A modern Library Visitor Management System.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-8 text-muted-foreground">
            Manage visitor logs, analyze traffic patterns, and provide a
            seamless self-service experience for your library patrons.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg">
              <span>Go to Dashboard</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
