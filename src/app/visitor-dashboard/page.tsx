/**
 * @fileoverview This page serves as a welcome screen for a logged-in visitor.
 * It displays their name, college, login time, and a table of their past library visits,
 * all within a single, clean card layout.
 */
'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VisitorHistoryTable } from '@/components/visitor-history-table';

/**
 * The main content of the visitor welcome page. It extracts user info from URL search parameters.
 */
function VisitorDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name') || 'Visitor';
  const college = searchParams.get('college') || 'N/A';
  const [loginTime, setLoginTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the login time once on the client to avoid hydration mismatch.
    setLoginTime(new Date());

    // Automatically redirect to the login page after 5 seconds.
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    // Clean up the timer when the component unmounts.
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="flex items-center gap-2"
        >
          <Image
            src="https://neu.edu.ph/main/img/neu.png"
            alt="NEU Logo"
            width={24}
            height={24}
            className="size-6"
          />
          <h1 className="text-lg font-semibold">NEU Library</h1>
        </a>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 sm:px-6 md:p-8">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to NEU Library</CardTitle>
            <CardDescription>
              Your visit has been successfully logged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Section for visitor's current login details. */}
            <div className="grid gap-2 rounded-md border p-4 text-sm">
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">Name:</p>
                <p className="font-semibold">{name}</p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">
                  Department/Office:
                </p>
                <p className="font-semibold">{college}</p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">Date:</p>
                {loginTime ? (
                  <p>{format(loginTime, 'MMMM dd, yyyy')}</p>
                ) : (
                  <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
                )}
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">
                  Login Time:
                </p>
                {loginTime ? (
                  <p>{format(loginTime, 'h:mm:ss a')}</p>
                ) : (
                  <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
                )}
              </div>
            </div>

            {/* Section for the visitor's complete history. */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Your Visit History</h3>
                <p className="text-sm text-muted-foreground">
                  A log of your recent visits to the library.
                </p>
              </div>
              <VisitorHistoryTable visitorName={name} college={college} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/**
 * Main export for the visitor dashboard, wrapped in Suspense to handle loading of URL parameters.
 */
export default function VisitorDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitorDashboardContent />
    </Suspense>
  );
}
