'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { County, WISCONSIN_COUNTIES } from '@/lib/supabase';

interface CountySidebarProps {
  availableCounties?: County[];
}

export default function CountySidebar({ availableCounties }: CountySidebarProps) {
  const pathname = usePathname();
  
  // If no counties are provided, create a default list from WISCONSIN_COUNTIES
  const counties = availableCounties || 
    WISCONSIN_COUNTIES.map((name) => ({ name }));
  
  return (
    <aside className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-foreground tracking-wide">Wisconsin Counties</h2>
        <div className="space-y-1">
          {counties.map((county) => {
            const countyPath = `/county/${county.name.toLowerCase().replace(/\s+/g, '-')}`;
            const isActive = pathname === countyPath || pathname.startsWith(`${countyPath}/`);
            
            return (
              <Link
                key={county.name}
                href={countyPath}
                className={`block px-4 py-2.5 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-gradient text-white font-medium'
                    : 'text-foreground hover:bg-secondary hover:translate-x-1'
                }`}
              >
                {county.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
} 