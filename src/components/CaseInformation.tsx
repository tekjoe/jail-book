'use client';

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';

interface Case {
  partyName: string;
  countyName: string;
  dob?: string;
  caseNo: string;
  countyNo: number;
  caption: string;
  status: string;
  filingDate: string;
}

interface CaseInformationProps {
  cases: Case[];
}

export default function CaseInformation({ cases }: CaseInformationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(cases.length / casesPerPage);
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (!cases || cases.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Court Cases</h2>
        <div className="p-4 bg-sidebar-bg rounded-md text-foreground opacity-70">
          No court cases found for this individual.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Court Cases ({cases.length})</h2>
      <div className="overflow-x-auto">
        <div className="bg-sidebar-bg rounded-md">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 border-b border-card-border bg-table-header-bg text-xs font-medium text-foreground uppercase">
            <div>Case Number</div>
            <div>County</div>
            <div>Filing Date</div>
            <div>Status</div>
            <div>Caption</div>
          </div>
          
          {/* Case rows */}
          <div className="divide-y divide-card-border">
            {currentCases.map((caseItem, index) => (
              <div key={`${caseItem.caseNo}-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 hover:bg-table-row-hover">
                <div className="text-foreground font-medium">{caseItem.caseNo}</div>
                <div className="text-foreground">{caseItem.countyName}</div>
                <div className="text-foreground">
                  {new Date(caseItem.filingDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-foreground">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    caseItem.status === 'Closed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {caseItem.status}
                  </span>
                </div>
                <div className="text-foreground">{caseItem.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
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
                    className="px-3 py-1 rounded border bg-card-bg text-foreground border-card-border"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-[0.36rem] rounded border border-card-border bg-card-bg text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-foreground opacity-70">
        Data source: Wisconsin Circuit Court Access (WCCA)
      </div>
    </div>
  );
} 