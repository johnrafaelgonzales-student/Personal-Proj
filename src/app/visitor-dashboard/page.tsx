/**
 * @fileoverview This page displays the dashboard for a logged-in visitor.
 * It shows a welcome message and a table of the visitor's past library visits.
 */
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

/**
 * The main content of the visitor dashboard. It extracts user info from URL search parameters.
 */
function VisitorDashboardContent() {
  const searchParams = useSearchParams();
  // Get the visitor's name and college from the URL, with fallbacks.
  const name = searchParams.get('name') || mockUser.name;
  const college = searchParams.get('college') || '';

  // Utility function to generate initials from a name string for the avatar fallback.
  const getInitials = (nameStr: string) => {
    const cleanedName = nameStr.replace(',', '');
    const parts = cleanedName.split(' ').filter(Boolean);
    if (parts.length > 1) {
      const firstInitial = parts[0][0] || '';
      const lastInitial = parts[parts.length - 1][0] || '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return '??';
  };

  const initials = getInitials(name);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="flex items-center gap-2"
        >
          <BookOpenCheck className="size-6 text-primary" />
          <h1 className="text-lg font-semibold">NEU Library</h1>
        </a>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{name}</span>
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
                  <AvatarFallback>{initials}</AvatarFallback>
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
              <CardTitle>Welcome, {name}!</CardTitle>
              <CardDescription>
                Here's a summary of your recent library visits.
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Renders the table with the visitor's specific history. */}
          <VisitorHistoryTable visitorName={name} college={college} />
        </div>
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
