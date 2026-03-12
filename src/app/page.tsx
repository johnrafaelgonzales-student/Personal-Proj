'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookCopy,
  BookOpenCheck,
  LayoutDashboard,
  PlusCircle,
  Settings,
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
          <Link href="/" className="flex items-center gap-2">
            <BookOpenCheck className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">LibFlow</h1>
          </Link>
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
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>GR</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Gonzales, Rafael</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
