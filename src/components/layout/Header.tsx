import { LineChart, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b p-4 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquareQuote className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            <Link href="/">ContentFlow AI</Link>
          </h1>
        </div>
        {/* <nav>
          <Link href="/analytics" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <LineChart className="h-5 w-5" />
            Analytics
          </Link>
        </nav> */}
      </div>
    </header>
  );
}
