import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight font-headline">
          Welcome to LoginFlow
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A demonstration of a modern, secure, and user-friendly login experience, inspired by the best.
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg font-bold py-7 px-10">
            View Login Page
          </Button>
        </Link>
      </div>
    </main>
  );
}
