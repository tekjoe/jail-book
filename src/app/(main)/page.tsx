import React from 'react';
import Link from 'next/link';
import { getCountyByName } from '@/lib/supabase';

export default async function HomePage() {
  // Get Vilas County for the featured link
  const vilasCounty = await getCountyByName('Vilas');
  const vilasCountyId = vilasCounty?.id || 72; // Fallback to 72 (Vilas is the 72nd county alphabetically)
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-foreground tracking-tight">Wisconsin Inmate Lookup</h1>
      
      <div className="bg-card-bg border border-card-border rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-foreground">Welcome to the Wisconsin Inmate Lookup System</h2>
        <p className="mb-4 text-foreground opacity-90">
          This application allows you to view current inmates in Wisconsin county jails.
          Select a county from the sidebar to view the list of inmates currently held in that county's jail.
        </p>
        <p className="mb-4 text-foreground opacity-90">
          Data is updated daily at 8:00 AM CST from official county sources.
        </p>
        <div className="mt-6">
          <Link 
            href={`/county/${vilasCountyId}/vilas`}
            className="bg-primary-gradient text-white px-5 py-2.5 rounded-md shadow-md inline-block hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
          >
            View Vilas County Inmates
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-bg border border-card-border rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">How to Use</h3>
          <ul className="list-disc pl-5 space-y-2 text-foreground opacity-90">
            <li>Select a county from the sidebar</li>
            <li>View the list of current inmates</li>
            <li>Use the search box to find specific inmates</li>
          </ul>
        </div>
        
        <div className="bg-card-bg border border-card-border rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">About the Data</h3>
          <p className="text-foreground opacity-90">
            Inmate information is collected from official county jail rosters.
            The data is updated daily and includes only current inmates.
            For more detailed information, please contact the specific county sheriff's office.
          </p>
        </div>
      </div>
    </div>
  );
} 