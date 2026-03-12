'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookCopy,
  BookOpenCheck,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Shield,
  User as UserIcon,
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
import { VisitorDashboard } from '@/components/visitor-dashboard';
import { VisitorLogTable } from '@/components/visitor-log-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Admin
type AdminView = 'dashboard' | 'log';
const adminViewTitles: Record<AdminView, string> = {
  dashboard: 'Dashboard',
  log: 'Visitor Log',
};

// Visitor
const visitorViewTitle = 'Dashboard';

type ViewMode = 'admin' | 'visitor';

export default function DashboardPage() {
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('admin');

  const isAdmin = viewMode === 'admin';

  const renderContent = () => {
    if (isAdmin) {
      switch (activeAdminView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'log':
          return <VisitorLogTable />;
        default:
          return <AdminDashboard />;
      }
    }
    // Visitor
    return <VisitorDashboard />;
  };

  const getHeaderTitle = () => {
    if (isAdmin) {
      return adminViewTitles[activeAdminView];
    }
    return visitorViewTitle;
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
            {isAdmin ? (
              <>
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
              </>
            ) : (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={true} // Always active as it's the only view
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
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
            {isAdmin && (
              <ManualEntryForm>
                <Button>
                  <PlusCircle />
                  <span>Manual Entry</span>
                </Button>
              </ManualEntryForm>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Demonstration Mode</CardTitle>
              <CardDescription>
                Authentication is disabled. Switch between views to see the
                different dashboards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={viewMode}
                onValueChange={(value) => setViewMode(value as ViewMode)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin View
                  </TabsTrigger>
                  <TabsTrigger value="visitor">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Visitor View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
