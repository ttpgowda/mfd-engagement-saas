import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="text-xl font-bold">MFD Engagement SaaS</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Supercharge Your Mutual Fund Distribution
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Manage leads, track schemes, and analyze performance with our comprehensive engagement platform.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
