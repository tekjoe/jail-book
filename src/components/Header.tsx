import React from 'react';
import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-card-bg border-b border-card-border py-4">
      <div className="container mx-auto flex items-center justify-between max-w-7xl mx-auto px-4 md:px-0">
        <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2">
          <span className="bg-primary bg-opacity-10 p-1.5 rounded-md">
            <HomeIcon className="h-5 w-5 text-primary" />
          </span>
          Wisconsin Inmate Lookup
        </Link>
        <nav>
          <Link 
            href="/counties" 
            className="text-foreground hover:text-primary transition-colors"
          >
            <span className="hidden md:inline">Browse Counties</span>
            <span className="md:hidden">Counties</span>
          </Link>
        </nav>
      </div>
    </header>
  );
} 