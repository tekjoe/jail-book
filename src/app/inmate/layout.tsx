import React from 'react';
import Link from 'next/link';

export default function InmateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card-bg border-b border-card-border py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Wisconsin Inmate Lookup
          </Link>
        </div>
      </header>
      
      <main className="flex-1 bg-background-gradient">
        {children}
      </main>
      
      <footer className="bg-card-bg border-t border-card-border py-4">
        <div className="container mx-auto px-4 text-center text-foreground opacity-70 text-sm">
          &copy; {new Date().getFullYear()} Wisconsin Inmate Lookup System
        </div>
      </footer>
    </div>
  );
} 