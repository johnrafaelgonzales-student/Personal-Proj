'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Contact, Fingerprint } from 'lucide-react';

export function LoginOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const handleRfidLogin = () => {
    // Simulate RFID tap and redirect
    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/visitor-dashboard');
    }
  };

  const handleManualEntry = () => {
    router.push(`/manual-login?role=${role}`);
  };

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-center text-2xl capitalize text-white">{role} Login</CardTitle>
        <CardDescription className="text-center text-gray-300">
          Please select your login method.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleRfidLogin}>
          <Fingerprint className="mr-2 h-5 w-5" />
          Tap RFID Card
        </Button>
        <Button size="lg" variant="outline" className="w-full border-primary text-primary-foreground hover:bg-primary/10" onClick={handleManualEntry}>
           <Contact className="mr-2 h-5 w-5" />
           Manual Entry
        </Button>
      </CardContent>
    </Card>
  );
}
