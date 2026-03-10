import { BookOpenCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-lg font-semibold">
            <BookOpenCheck className="size-6 text-primary" />
            <h1>LibFlow</h1>
        </div>
      {children}
    </div>
  );
}
