/**
 * @fileoverview This is the home page of the application.
 * It serves as a role selection screen, allowing the user to identify as either an Admin or a Visitor.
 */
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { User, Shield, BookOpenCheck } from 'lucide-react';
import { RealTimeClock } from '@/components/real-time-clock';

/**
 * The main component for the new landing page.
 */
export default function LandingPage() {
  const router = useRouter();

  /**
   * Scrolls the view to the role selection section.
   */
  const scrollToRoleSelection = () => {
    const section = document.getElementById('role-selection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image and Overlay */}
      <Image
        src="https://www.manilatimes.net/manilatimes/uploads/images/2021/11/24/29148.jpg"
        alt="Library background"
        fill
        className="object-cover"
        priority
        data-ai-hint="library building"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-start justify-between p-4 text-white md:p-6">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="size-8 text-white" />
          <h1 className="text-2xl font-semibold">NEU Library</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <RealTimeClock />
          <Button onClick={scrollToRoleSelection}>Log In</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-16 p-4 pt-40 pb-20 text-white md:pt-20">
        {/* Welcome & Description Section */}
        <div className="text-center">
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-5xl font-bold md:text-7xl [text-shadow:0_0_12px_hsl(var(--primary))]">
                Welcome to the NEU Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mt-4 text-lg text-primary-foreground/80 mx-auto max-w-4xl">
                The NEU Library is a modern hub for learning and collaboration.
                It's a place for students to study in quiet focus, rest between
                classes, discover new worlds through our extensive collection
                of books, and connect with peers. With state-of-the-art
                facilities, access to digital archives, and a serene
                atmosphere, we provide the perfect environment for academic
                growth and intellectual exploration. Our dedicated staff is
                always available to assist with research and resource
                navigation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role Selection Section */}
        <div id="role-selection" className="w-full max-w-md">
          <Card className="relative bg-background/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-foreground">
                Continue as...
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-6">
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push('/login?role=admin')}
              >
                <Shield className="mr-2 h-5 w-5" />
                Admin
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
                onClick={() => router.push('/login?role=visitor')}
              >
                <User className="mr-2 h-5 w-5" />
                Visitor
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
