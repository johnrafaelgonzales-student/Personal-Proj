'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { mockVisitors } from '@/lib/data';
import { VisitorHistoryTable } from './visitor-history-table';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

export function VisitorDashboard() {
  // Using the first mock user for demonstration to ensure history data is available.
  const user = mockVisitors[0];
  const userEmail = `${user.name.toLowerCase().replace(' ', '.')}@neu.edu.ph`;

  return (
    <div className="grid gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name || 'Visitor'}!</CardTitle>
          <CardDescription>This is your personal dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {user.avatarUrl && (
              <AvatarImage asChild src={user.avatarUrl}>
                <Image
                  src={user.avatarUrl}
                  alt="user avatar"
                  width={64}
                  height={64}
                  data-ai-hint="person portrait"
                />
              </AvatarImage>
            )}
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      <VisitorHistoryTable />

      <Card>
        <CardHeader>
          <CardTitle>Self-Service Kiosk</CardTitle>
          <CardDescription>
            To log a new visit, please return to the home screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Kiosk
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
