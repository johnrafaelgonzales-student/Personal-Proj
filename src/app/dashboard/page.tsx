'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookCopy,
  BookOpenCheck,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ManualEntryForm } from '@/components/manual-entry-form';
import { AdminDashboard } from '@/components/admin-dashboard';
import { VisitorLogTable } from '@/components/visitor-log-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


type AdminView = 'dashboard' | 'log';
const adminViewTitles: Record<AdminView, string> = {
  dashboard: 'Dashboard',
  log: 'Visitor Log',
};

export default function AdminDashboardPage() {
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');

  const renderContent = () => {
    switch (activeAdminView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'log':
        return <VisitorLogTable />;
      default:
        return <AdminDashboard />;
    }
  };

  const getHeaderTitle = () => {
    return adminViewTitles[activeAdminView];
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
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
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveAdminView('dashboard')}
                isActive={activeAdminView === 'dashboard'}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveAdminView('log')}
                isActive={activeAdminView === 'log'}
              >
                <BookCopy />
                <span>Visitor Log</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/95 px-4 lg:px-6">
          <h2 className="text-xl font-semibold">{getHeaderTitle()}</h2>
          <div className="flex items-center gap-4">
            <ManualEntryForm>
              <Button>
                <PlusCircle />
                <span>Manual Entry</span>
              </Button>
            </ManualEntryForm>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full h-8 w-8"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>GR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Gonzales, Rafael</DropdownMenuLabel>
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
