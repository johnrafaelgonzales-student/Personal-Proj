/**
 * @fileoverview This is the home page of the application.
 * It serves as a role selection screen, allowing the user to identify as either an Admin or a Visitor.
 */
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, ArrowDown } from 'lucide-react';

/**
 * The main component for the new landing page.
 */
export default function LandingPage() {
  const router = useRouter();

  /**
   * Scrolls the view to the specified section.
   * @param {string} sectionId - The ID of the section to scroll to.
   */
  const scrollToNext = (sectionId: string) => {
    const nextSection = document.getElementById(sectionId);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full snap-y snap-mandatory overflow-y-scroll text-white">
      {/* Section 1: Welcome Message */}
      <section
        id="welcome"
        className="relative flex h-screen w-full snap-start flex-col items-center justify-center"
      >
        <Image
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop"
          alt="Library background"
          fill
          className="object-cover"
          data-ai-hint="library books"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold md:text-7xl [text-shadow:0_0_12px_hsl(var(--primary))]">
            Welcome to the NEU Library
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Your gateway to knowledge and discovery.
          </p>
        </div>
        <button
          onClick={() => scrollToNext('description')}
          className="absolute bottom-10 z-10 animate-bounce rounded-full p-2"
          aria-label="Scroll to next section"
        >
          <ArrowDown className="h-8 w-8" />
        </button>
      </section>

      {/* Section 2: Library Description */}
      <section
        id="description"
        className="relative flex h-screen w-full snap-start flex-col items-center justify-center bg-background p-8 text-center text-foreground"
      >
        <div className="max-w-4xl">
          <h2 className="text-4xl font-bold text-primary md:text-5xl">
            A Space for Growth
          </h2>
          <p className="mt-6 text-lg text-foreground/80">
            The NEU Library is a modern hub for learning and collaboration. It's
            a place for students to study in quiet focus, rest between classes,
            discover new worlds through our extensive collection of books, and
            connect with peers. With state-of-the-art facilities, access to
            digital archives, and a serene atmosphere, we provide the perfect
            environment for academic growth and intellectual exploration. Our
            dedicated staff is always available to assist with research and
            resource navigation.
          </p>
        </div>
        <button
          onClick={() => scrollToNext('role-selection')}
          className="absolute bottom-10 z-10 animate-bounce rounded-full p-2"
          aria-label="Scroll to next section"
        >
          <ArrowDown className="h-8 w-8 text-primary" />
        </button>
      </section>

      {/* Section 3: Role Selection */}
      <section
        id="role-selection"
        className="relative flex h-screen w-full snap-start items-center justify-center"
      >
        <Image
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop"
          alt="Library books background"
          fill
          className="object-cover"
          data-ai-hint="library books"
        />
        <div className="absolute inset-0 bg-black/60" />
        <Card className="relative w-full max-w-md bg-background/80 backdrop-blur-md">
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
      </section>
    </div>
  );
}
