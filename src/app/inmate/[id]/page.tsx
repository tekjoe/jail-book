import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import CaseInformation from '@/components/CaseInformation';


interface InmatePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getInmateById(id: string) {
  try {
    const { data, error } = await supabase
      .from('inmates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching inmate with ID ${id}:`, error);
    return null;
  }
}

async function fetchCaseInformation(firstName: string, lastName: string, middleName: string) {
  try {
    const response = await fetch('https://wcca.wicourts.gov/jsonPost/caseSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeMissingDob: false,
        includeMissingMiddleName: true,
        lastName: lastName,
        firstName: firstName,
        middleName: middleName,
        countyNo: ""
      }),
      cache: 'no-store' // Don't cache this request
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result?.cases || [];
  } catch (error) {
    console.error('Error fetching case information:', error);
    return [];
  }
}

export default async function InmatePage({ params }: InmatePageProps) {
  const { id } = await params;
  const inmate = await getInmateById(id);
  
  if (!inmate) {
    notFound();
  }
  
  // Get county ID for the back link
  const countySlug = inmate.county.toLowerCase().replace(/\s+/g, '-');
  
  // Fetch case information
  const caseInformation = await fetchCaseInformation(inmate.first_name, inmate.last_name, inmate.middle_name);
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-card-bg border border-card-border rounded-lg shadow-md p-4">
        <div className="mb-6">
          <Link 
            href={`/county/${countySlug}`}
            className="text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {inmate.county} County
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-6 capitalize">
          {inmate.first_name} {inmate.middle_name} {inmate.last_name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Inmate Details</h2>
              <div className="mt-2 p-4 bg-sidebar-bg rounded-md">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-foreground opacity-70">First Name:</span>
                  <span className="text-foreground col-span-2 capitalize">{inmate.first_name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-foreground opacity-70">Middle Name:</span>
                  <span className="text-foreground col-span-2 capitalize">{inmate.middle_name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-foreground opacity-70">Last Name:</span>
                  <span className="text-foreground col-span-2 capitalize">{inmate.last_name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-foreground opacity-70">County:</span>
                  <span className="text-foreground col-span-2">{inmate.county}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Record Information</h2>
              <div className="mt-2 p-4 bg-sidebar-bg rounded-md">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="text-foreground opacity-70">ID:</span>
                  <span className="text-foreground col-span-2 break-all">{inmate.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-foreground opacity-70">Added:</span>
                  <span className="text-foreground col-span-2">
                    {new Date(inmate.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Case Information Section */}
        <div className="mt-8">
          <CaseInformation cases={caseInformation} />
        </div>
        
        <div className="mt-8 pt-6 border-t border-card-border">
          <p className="text-foreground opacity-70 text-sm">
            This information is updated daily at 8:00 AM CST. For more detailed information, please contact the {inmate.county} County Sheriff&apos;s Office.
          </p>
        </div>
      </div>
    </div>
  );
} 