import React from 'react';
import CountySidebar from '@/components/CountySidebar';
import { getCounties } from '@/lib/supabase';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all counties from the database
  const counties = await getCounties();

  return (
    <div className="flex h-screen">
      <CountySidebar availableCounties={counties} />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 