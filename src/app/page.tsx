'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Mail,
  Loader2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockVisitors } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

type KioskState = 'idle' | 'email' | 'loading' | 'success';

const randomUser = mockVisitors[Math.floor(Math.random() * mockVisitors.length)];

export default function HomePage() {
  const [state, setState] = useState<KioskState>('idle');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const { toast } = useToast();

  const handleAction = async (action: 'rfid' | 'email') => {
    setState('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (action === 'email' && !email.endsWith('@neu.edu.ph')) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please use a valid institutional email (@neu.edu.ph).',
      });
      setState('email');
      return;
    }

    setState('success');
  };

  const handleFinish = async () => {
    if (!purpose) {
      toast({
        variant: 'destructive',
        title: 'Purpose Required',
        description: 'Please select your purpose of visit.',
      });
      return;
    }
    setState('loading');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Entry Logged!',
      description: `Welcome, ${randomUser.name}! Your visit has been recorded.`,
    });
    resetState();
  };

  const resetState = () => {
    setState('idle');
    setEmail('');
    setPurpose('');
  };

  const renderState = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Processing Entry...</p>
          </div>
        );
      case 'email':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Institutional Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="your.name@neu.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleAction('email')}
              className="w-full max-w-sm"
            >
              Proceed <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="link" onClick={resetState}>
              Back to options
            </Button>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage asChild src={randomUser.avatarUrl}>
                    <Image
                      src={randomUser.avatarUrl}
                      alt="user avatar"
                      width={64}
                      height={64}
                    />
                  </AvatarImage>
                  <AvatarFallback>{randomUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-2xl font-bold text-left">
                    {randomUser.name}
                  </p>
                  <p className="text-muted-foreground text-left">
                    {randomUser.college}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm space-y-2 text-left">
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Select onValueChange={setPurpose} value={purpose}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select a purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Borrow/Return">Borrow/Return</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleFinish} className="w-full max-w-sm">
              Confirm Entry
            </Button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-32 text-lg"
              onClick={() => handleAction('rfid')}
            >
              <CreditCard className="mr-4 h-8 w-8" /> Tap ID Card
            </Button>
            <Button
              variant="outline"
              className="h-32 text-lg"
              onClick={() => setState('email')}
            >
              <Mail className="mr-4 h-8 w-8" /> Enter Email
            </Button>
          </div>
        );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <Link href="/dashboard" passHref>
          <Button variant="outline">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <Card
        className={cn(
          'w-full max-w-3xl transition-all duration-300',
          state !== 'idle' && 'max-w-md'
        )}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome to NEU Library!
          </CardTitle>
          <CardDescription className="text-md">
            Please log your entry using one of the options below.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderState()}</CardContent>
      </Card>
    </main>
  );
}
