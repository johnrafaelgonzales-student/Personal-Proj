/**
 * @fileoverview This component renders the login method selection card.
 * It's displayed after a user selects their role (Admin or Visitor).
 * It provides options like "Tap RFID Card" or "Manual Entry".
 */
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Contact, Fingerprint } from 'lucide-react';

/**
 * The main component for displaying login options.
 */
export function LoginOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Retrieves the 'role' (admin or visitor) from the URL query parameters.
  const role = searchParams.get('role');

  /**
   * Handles the simulated RFID login.
   * Redirects the user to the appropriate dashboard based on their role.
   */
  const handleRfidLogin = () => {
    // This is a simulation. In a real app, this would involve an RFID reader.
    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/visitor-dashboard');
    }
  };

  /**
   * Handles the manual entry login.
   * Redirects the user to the manual login form, preserving their role.
   */
  const handleManualEntry = () => {
    router.push(`/manual-login?role=${role}`);
  };

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl capitalize text-foreground">{role} Login</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please select your login method.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        {/* RFID Login Button */}
        <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleRfidLogin}>
          <Fingerprint className="mr-2 h-5 w-5" />
          Tap RFID Card
        </Button>
        {/* Manual Entry Button */}
        <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={handleManualEntry}>
           <Contact className="mr-2 h-5 w-5" />
           Manual Entry
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
