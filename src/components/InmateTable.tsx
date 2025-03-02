'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inmate, getInmatesByCountyPaginated } from '@/lib/supabase';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';


interface InmateTableProps {
  county: string;
  initialInmates?: Inmate[];
  initialTotalCount?: number;
}

export default function InmateTable({ 
  county, 
  initialInmates = [], 
  initialTotalCount = 0 
}: InmateTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inmates, setInmates] = useState<Inmate[]>(initialInmates);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const itemsPerPage = 25;
  
  // Debounce search term to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);
  
  // Fetch inmates when page, search term, or county changes
  useEffect(() => {
    const fetchInmates = async () => {
      setIsLoading(true);
      try {
        const result = await getInmatesByCountyPaginated(
          county,
          currentPage,
          itemsPerPage,
          debouncedSearchTerm
        );
        
        setInmates(result.inmates);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error fetching inmates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInmates();
  }, [county, currentPage, debouncedSearchTerm]);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Current Inmates in {county} County
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search inmates..."
            className="px-4 py-2.5 w-full md:w-auto bg-input-bg border border-input-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : inmates.length > 0 ? (
        <div className="bg-card-bg border border-card-border rounded-lg shadow-md overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-table-header-bg">
            <div className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Last Name
            </div>
            <div className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              Middle Name
            </div>
            <div className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
              First Name
            </div>
          </div>
          
          {/* Inmate Rows */}
          <div className="divide-y divide-card-border">
            {inmates.map((inmate) => (
              <Link 
                href={`/inmate/${inmate.id}`}
                key={`${inmate.county}-${inmate.last_name}-${inmate.first_name}`}
                className="grid grid-cols-3 hover:bg-table-row-hover transition-colors cursor-pointer"
              >
                <div className="px-6 py-4 text-sm font-medium text-foreground break-words capitalize">
                  {inmate.last_name}
                </div>
                <div className="px-6 py-4 text-sm text-foreground opacity-80 break-words capitalize">
                  {inmate.middle_name}
                </div>
                <div className="px-6 py-4 text-sm text-foreground opacity-80 break-words capitalize">
                  {inmate.first_name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-card-bg border border-card-border rounded-lg shadow-md">
          <p className="text-foreground opacity-80">No inmates found for {county} County.</p>
          {searchTerm && (
            <p className="text-foreground opacity-60 mt-2">
              Try adjusting your search or check back later.
            </p>
          )}
        </div>
      )}
      
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-foreground opacity-70">
          Total: {totalCount} {totalCount === 1 ? 'inmate' : 'inmates'}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isLoading}
              className="p-[0.36rem] rounded border border-card-border bg-card-bg text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-[0.36rem] rounded border border-card-border bg-card-bg text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum
                        ? 'bg-primary text-white border-primary'
                        : 'bg-card-bg text-foreground border-card-border'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-1 self-end">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={isLoading}
                    className="px-3 py-1 rounded border bg-card-bg text-foreground border-card-border"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="p-[0.36rem] rounded border border-card-border bg-card-bg text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="p-[0.36rem] rounded border border-card-border bg-card-bg text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 