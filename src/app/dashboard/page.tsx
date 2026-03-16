/**
 * @fileoverview This file defines the main page for the Admin Dashboard.
 * It uses a client-side rendered approach ('use client') to manage state for the active view
 * (Dashboard vs. Visitor Log) and handles the rendering of different sub-components.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
  BookCopy,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
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
  SidebarTrigger,
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

// Defines the possible views available in the admin dashboard.
type AdminView = 'dashboard' | 'log';
// Maps view keys to human-readable titles.
const adminViewTitles: Record<AdminView, string> = {
  dashboard: 'Dashboard',
  log: 'Visitor Log',
};

/**
 * The main component for the admin dashboard page.
 * It manages the layout, including the sidebar and main content area.
 */
export default function AdminDashboardPage() {
  // State to track the currently active view.
  const [activeAdminView, setActiveAdminView] = useState<AdminView>('dashboard');
  const { setTheme } = useTheme();

  // Renders the main content based on the active view state.
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

  // Gets the appropriate header title for the current view.
  const getHeaderTitle = () => {
    return adminViewTitles[activeAdminView];
  };

  return (
    <SidebarProvider defaultOpen={false}>
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
            <Image
              src="https://neu.edu.ph/main/img/neu.png"
              alt="NEU Logo"
              width={24}
              height={24}
              className="size-6"
            />
            <h1 className="text-lg font-semibold">NEU Library</h1>
          </a>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveAdminView('dashboard')}
                isActive={activeAdminView === 'dashboard'}
                closeSidebarOnClick
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveAdminView('log')}
                isActive={activeAdminView === 'log'}
                closeSidebarOnClick
              >
                <BookCopy />
                <span>Visitor Log</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Settings className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/95 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h2 className="text-xl font-semibold">{getHeaderTitle()}</h2>
          </div>
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
                    <AvatarFallback>EJ</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Esperanza, Jeremias</DropdownMenuLabel>
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
