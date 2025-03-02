import React from 'react';
import Link from 'next/link';
import { getCounties } from '@/lib/supabase';
import { ArrowRightIcon, MagnifyingGlassIcon, ShieldCheckIcon, ClockIcon, MapIcon } from '@heroicons/react/24/outline';

export default async function HomePage() {
  // Get all counties for the county grid
  const counties = await getCounties();
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-5 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Wisconsin Inmate Lookup
            </h1>
            <p className="text-xl md:text-2xl text-foreground opacity-80 max-w-3xl mx-auto mb-10">
              The only platform that provides access to <span className="text-primary font-semibold">all current inmates</span> throughout the state of Wisconsin in one unified system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/counties"
                className="bg-primary-gradient text-white px-8 py-3 rounded-md shadow-lg hover:brightness-110 hover:-translate-y-1 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-2"
              >
                Browse Counties <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card-bg relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Use Wisconsin Inmate Lookup?</h2>
            <p className="text-lg text-foreground opacity-70 max-w-2xl mx-auto">
              Our platform offers unique advantages for accessing inmate information across Wisconsin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sidebar-bg p-8 rounded-xl shadow-md border border-sidebar-border hover:border-primary transition-colors duration-300">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Coverage</h3>
              <p className="text-foreground opacity-70">
                Access inmate data from all 72 Wisconsin counties in one unified platform, eliminating the need to visit multiple websites.
              </p>
            </div>
            
            <div className="bg-sidebar-bg p-8 rounded-xl shadow-md border border-sidebar-border hover:border-primary transition-colors duration-300">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <ClockIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Daily Updates</h3>
              <p className="text-foreground opacity-70">
                Our data is refreshed daily at 8:00 AM CST directly from official county sources, ensuring you have the most current information.
              </p>
            </div>
            
            <div className="bg-sidebar-bg p-8 rounded-xl shadow-md border border-sidebar-border hover:border-primary transition-colors duration-300">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Official Data</h3>
              <p className="text-foreground opacity-70">
                All information is sourced directly from official county jail rosters, ensuring accuracy and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Counties Section */}
      <section id="counties" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Browse Counties</h2>
            <p className="text-lg text-foreground opacity-70 max-w-2xl mx-auto">
              Select a county to view current inmates. We currently have active data for Vilas, Waukesha, Barron, and Burnett counties.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {counties.slice(0, 24).map((county) => {
              const isActive = ['Vilas', 'Waukesha', 'Barron', 'Burnett'].includes(county.name);
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
            
            <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 text-center mt-6">
              <Link 
                href="/counties"
                className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                View all 72 counties <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-gradient text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Searching Wisconsin Inmates Today</h2>
          <p className="text-lg opacity-90 mb-10 max-w-3xl mx-auto">
            Access comprehensive inmate data from across Wisconsin in one unified platform. Updated daily with official information.
          </p>
          <Link 
            href="/counties"
            className="bg-white text-primary px-8 py-3 rounded-md shadow-lg hover:brightness-110 hover:-translate-y-1 transition-all duration-300 text-lg font-medium inline-block"
          >
            Browse Counties
          </Link>
        </div>
      </section>
    </>
  );
} 