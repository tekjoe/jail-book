import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background-gradient">
      <div className="text-center max-w-md bg-card-bg border border-card-border rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404 - Not Found</h1>
        <p className="text-foreground opacity-70 mb-8">
          The county or page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary-gradient text-white px-5 py-2.5 rounded-md shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 