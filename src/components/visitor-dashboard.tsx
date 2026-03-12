'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export function VisitorDashboard() {
  const { user } = useUser();

  return (
    <div className="grid gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.displayName || 'Visitor'}!</CardTitle>
          <CardDescription>This is your personal dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {user && (
            <Avatar className="h-16 w-16">
              {user.photoURL && (
              <AvatarImage asChild src={user.photoURL}>
                  <Image src={user.photoURL} alt="user avatar" width={64} height={64} data-ai-hint="person portrait" />
              </AvatarImage>
              )}
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div>
              <p className="font-semibold">{user?.displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Log Your Visit</CardTitle>
          <CardDescription>Use the Self-Service menu item to log your visit to the library.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
