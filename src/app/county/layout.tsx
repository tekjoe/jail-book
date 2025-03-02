import React from 'react';
import { getCounties } from '@/lib/supabase';
import Header from '@/components/Header';

export default async function CountyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all counties from the database

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {children}
    </main>
  );
} 