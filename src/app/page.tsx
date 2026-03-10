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
import { DashboardOverview } from '@/components/dashboard-overview';
import { VisitorLogTable } from '@/components/visitor-log-table';
import { SelfServiceKiosk } from '@/components/self-service-kiosk';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';

type View = 'dashboard' | 'log' | 'kiosk';

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  log: 'Visitor Log',
  kiosk: 'Self-Service Kiosk',
};

export default function LibFlowApp() {
  const [activeView, setActiveView] = useState<View>('dashboard');
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

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'log':
        return <VisitorLogTable />;
      case 'kiosk':
        return <SelfServiceKiosk />;
      default:
        return <DashboardOverview />;
    }
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
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('dashboard')}
                isActive={activeView === 'dashboard'}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('log')}
                isActive={activeView === 'log'}
              >
                <BookCopy />
                <span>Visitor Log</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('kiosk')}
                isActive={activeView === 'kiosk'}
              >
                <ScanLine />
                <span>Self-Service</span>
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
          <h2 className="text-xl font-semibold">{viewTitles[activeView]}</h2>
          <div className="flex items-center gap-4">
            <ManualEntryForm>
              <Button>
                <PlusCircle />
                <span>Manual Entry</span>
              </Button>
            </ManualEntryForm>
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
