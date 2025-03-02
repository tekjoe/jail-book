import React from 'react';
import { notFound } from 'next/navigation';
import InmateTable from '@/components/InmateTable';
import { getInmatesByCountyPaginated, getCountyByName, WISCONSIN_COUNTIES } from '@/lib/supabase';


interface CountyPageProps {
  params: Promise<{
    county: string;
  }>;
}

export default async function CountyPage(props: CountyPageProps) {
  const params = await props.params;
  // Format the county name for database lookup
  const { county: countyParam } = params;
  const formattedCounty = countyParam
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get county from database
  const county = await getCountyByName(formattedCounty);

  if (!county) {
    notFound();
  }

  // Fetch initial inmates for this county
  const { inmates, totalCount } = await getInmatesByCountyPaginated(county.name, 1, 25);

  return (
      <div className="w-full">
        <InmateTable 
          county={county.name} 
        initialInmates={inmates}
          initialTotalCount={totalCount}
        />
      </div>
  );
}

// Generate static params for all Wisconsin counties
export function generateStaticParams() {
  return WISCONSIN_COUNTIES.map(name => ({
    county: name.toLowerCase().replace(/\s+/g, '-'),
  }));
} 