/**
 * @fileoverview This component displays a pulsating ID card visual to simulate an RFID tap.
 * After a brief delay, it redirects the user to their respective dashboard.
 */
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact } from 'lucide-react';

/**
 * The main component for the pulsating RFID card UI.
 */
export function PulsatingRfidCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  useEffect(() => {
    // This timer simulates the RFID reading process.
    const timer = setTimeout(() => {
      if (role === 'admin') {
        router.push('/dashboard');
      } else {
        // In a real app, you might pass user data from the RFID scan.
        router.push(`/visitor-dashboard`);
      }
    }, 3000); // Simulate a 3-second tap and then redirect.

    return () => clearTimeout(timer);
  }, [router, role]);

  return (
    <Card className="w-full max-w-md animate-pulse bg-background/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-foreground">
          Tap your ID
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
        <Contact className="h-24 w-24 text-primary" />
        <p className="text-muted-foreground">Waiting for RFID card...</p>
      </CardContent>
    </Card>
  );
}
