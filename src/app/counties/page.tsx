import React from 'react';
import Link from 'next/link';
import { getCounties } from '@/lib/supabase';
import Header from '@/components/Header';
import { MapIcon } from '@heroicons/react/24/outline';
export default async function CountiesPage() {
  // Get all counties for the county grid
  const counties = await getCounties();
  
  return (
      <main className="flex-1 bg-background-gradient">
        {/* Counties Section */}
        <section id="counties" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Wisconsin Counties</h2>
              <p className="text-lg text-foreground opacity-70 max-w-2xl mx-auto">
                Select a county to view current inmates and detailed information.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {counties.map((county) => {
              const isActive = ['Vilas', 'Waukesha', 'Barron', 'Burnett', 'Calumet'].includes(county.name);
              const countySlug = county.name.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Link
                  key={county.id}
                  href={`/county/${countySlug}`}
                  className={`p-4 rounded-lg text-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-gradient text-white shadow-md hover:-translate-y-1 hover:shadow-lg' 
                      : 'bg-card-bg text-foreground opacity-60 hover:opacity-100 border border-card-border'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <MapIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{county.name}</span>
                  {isActive && (
                    <div className="mt-2 text-xs bg-white bg-opacity-20 rounded-full px-2 py-1">
                      Active
                    </div>
                  )}
                </Link>
              );
            })}
            </div>
          </div>
        </section>
      </main>
  );
}
