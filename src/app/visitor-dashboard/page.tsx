'use client';

import Link from 'next/link';
import { BookOpenCheck, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VisitorHistoryTable } from '@/components/visitor-history-table';
import { mockUser } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function VisitorDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpenCheck className="size-6 text-primary" />
          <h1 className="text-lg font-semibold">LibFlow</h1>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{mockUser.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={mockUser.avatarUrl}
                    alt="Visitor Avatar"
                    data-ai-hint="person portrait"
                  />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {mockUser.name}!</CardTitle>
              <CardDescription>
                Here's a summary of your recent library visits.
              </CardDescription>
            </CardHeader>
          </Card>
          <VisitorHistoryTable />
        </div>
      </main>
    </div>
  );
}
