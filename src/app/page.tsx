/**
 * @fileoverview This is the home page of the application.
 * It serves as a dynamic, multi-section landing page inspired by modern web design.
 */
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RealTimeClock } from '@/components/real-time-clock';

/**
 * The main component for the new landing page.
 */
export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full text-foreground">
      {/* Fixed background image */}
      <Image
        src="https://www.manilatimes.net/manilatimes/uploads/images/2021/11/24/29148.jpg"
        alt="Library background"
        fill
        className="fixed inset-0 -z-10 object-cover"
        priority
        data-ai-hint="library building"
      />
      <div className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-sm" />

      {/* Header */}
      <header className="sticky top-0 z-20 w-full bg-sky-600 shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4 text-white">
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
              width={32}
              height={32}
              className="size-8"
            />
            <h1 className="text-2xl font-semibold">NEU Library</h1>
          </a>
          <div className="flex items-center gap-4">
            <RealTimeClock />
            <Button
              onClick={() => router.push('/login')}
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Welcome Section */}
        <section className="relative flex h-[calc(100vh-68px)] flex-col items-center justify-center text-white">
          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-bold md:text-7xl [text-shadow:0_0_12px_hsl(var(--primary))]">
              Welcome to the NEU Library
            </h2>
          </div>
        </section>

        {/* Description Section */}
        <section className="bg-background/90 py-20 lg:py-28">
          <div className="container mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center">
              <Image
                src="https://img.freepik.com/free-vector/stack-colorful-books_1308-171744.jpg"
                alt="Stack of colorful books"
                width={400}
                height={400}
                className="rounded-lg"
                data-ai-hint="books illustration"
              />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-bold text-primary">
                A Hub for Knowledge and Discovery
              </h3>
              <p className="text-lg text-muted-foreground">
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
            </div>
          </div>
        </section>

        {/* Features Sections */}
        <section className="bg-muted/90 py-20 lg:py-28">
          <div className="container mx-auto space-y-20">
            {/* Computer Room */}
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="text-3xl font-bold text-primary">
                  Computer Room
                </h3>
                <p className="text-lg text-muted-foreground">
                  Our state-of-the-art computer room provides students with
                  access to high-speed internet and essential software for
                  research, assignments, and creative projects. It's a quiet,
                  focused environment perfect for completing homework, coding,
                  or diving deep into online databases. We ensure all
                  workstations are regularly updated and maintained to support
                  your academic success.
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src="https://media.istockphoto.com/id/1165294902/vector/desktop-computer-icon-flat-led-screen-monitor-pc-modern-personal-monitor-office-and-home.jpg?s=612x612&w=0&k=20&c=YtP0P84oPncvlV0JNTb2xNUWJ3lFoZwb03gsWwpLrW8="
                  alt="Desktop Computer"
                  width={400}
                  height={400}
                  className="rounded-lg bg-white p-4"
                  data-ai-hint="computer icon"
                />
              </div>
            </div>

            {/* Lounge Room */}
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="flex justify-center md:order-2">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_tZf8Htz2nzpoBr4ya0kvQjolb6-MVYPrDw&s"
                  alt="Lounge area with sofas"
                  width={400}
                  height={400}
                  className="rounded-lg"
                  data-ai-hint="lounge sofa"
                />
              </div>
              <div className="space-y-4 text-center md:text-left md:order-1">
                <h3 className="text-3xl font-bold text-primary">Lounge Room</h3>
                <p className="text-lg text-muted-foreground">
                  Need a break from studying? Our comfortable lounge room is the
                  perfect spot to relax, socialize, and recharge. Grab a comfy
                  seat, chat with friends, or even enjoy a quick mobile game.
                  It's a casual space designed for student well-being,
                  fostering connections and providing a necessary respite from
                  academic pressures.
                </p>
              </div>
            </div>

            {/* Discussion Room */}
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="text-3xl font-bold text-primary">
                  Discussion Room
                </h3>
                <p className="text-lg text-muted-foreground">
                  Collaborate effectively in our dedicated discussion rooms.
                  These spaces are equipped with whiteboards and are ideal for
                  group projects, study sessions, and brainstorming meetings.
                  You can use the room to ensure your group has a private,
                  productive environment to work on presentations, debate
                  ideas, and achieve your collective academic goals.
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src="https://media.istockphoto.com/id/1318577181/vector/flat-vector-illustration-of-school-classroom-whiteboard-with-black-marker-isolated-on-white.jpg?s=612x612&w=0&k=20&c=o-rgMCR8T9mdFX1j44ayW1es_AfAhSqd6VkM6_-FeS4="
                  alt="Whiteboard for discussion"
                  width={400}
                  height={400}
                  className="rounded-lg bg-white p-4"
                  data-ai-hint="whiteboard illustration"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
