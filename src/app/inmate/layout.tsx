import React from 'react';
import Header from '@/components/Header';

export default function InmateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="flex-1 bg-background-gradient">
        {children}
      </main>
  );
} 