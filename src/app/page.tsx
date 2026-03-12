'use client';

import { useState, useEffect } from 'react';
import {
  BookCopy,
  BookOpenCheck,
  LayoutDashboard,
  PlusCircle,
  ScanLine,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { UserNav } from '@/components/user-nav';
import { ManualEntryForm } from '@/components/manual-entry-form';
import { AdminDashboard } from '@/components/admin-dashboard';
import { VisitorDashboard } from '@/components/visitor-dashboard';
import { VisitorLogTable } from '@/components/visitor-log-table';
import { SelfServiceKiosk } from '@/components/self-service-kiosk';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';

// Admin
type AdminView = 'dashboard' | 'log';
const adminViewTitles: Record<AdminView, string> = {
  dashboard: 'Dashboard',
  log: 'Visitor Log',
};

// Visitor
type VisitorView = 'dashboard' | 'kiosk';
const visitorViewTitles: Record<VisitorView, string> = {
  dashboard: 'Dashboard',
  kiosk: 'Self-Service Kiosk',
};

export default function LibFlowApp() {
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');
  const [activeVisitorView, setActiveVisitorView] =
    useState<VisitorView>('dashboard');
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

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
    switch (activeVisitorView) {
      case 'dashboard':
        return <VisitorDashboard />;
      case 'kiosk':
        return <SelfServiceKiosk />;
      default:
        return <VisitorDashboard />;
    }
  };

  const getHeaderTitle = () => {
    if (isAdmin) {
      return adminViewTitles[activeAdminView];
    }
    return visitorViewTitles[activeVisitorView];
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">LibFlow</h1>
          </div>
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
                    onClick={() => setActiveVisitorView('dashboard')}
                    isActive={activeVisitorView === 'dashboard'}
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveVisitorView('kiosk')}
                    isActive={activeVisitorView === 'kiosk'}
                  >
                    <ScanLine />
                    <span>Self-Service</span>
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
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
