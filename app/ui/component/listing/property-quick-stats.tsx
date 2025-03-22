import React from 'react';

interface PropertyQuickStatsProps {
    beds: number;
    baths: number;
    size: number;
}

export default function PropertyQuickStats({ beds, baths, size }: PropertyQuickStatsProps) {
    return (
      <div className="flex items-center gap-4 mb-4 text-gray-600">
        {/* Beds */}
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 9.75h19.5m-19.5 0v9a1.5 1.5 0 001.5 1.5h1.5m16.5-10.5v9a1.5 1.5 0 01-1.5 1.5h-1.5m-9-3h6"
            />
          </svg>
          <span>{beds} bed</span>
        </div>
  
        {/* Baths */}
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10.5h18m-9 0V5.25m0 0h1.125a2.25 2.25 0 110 4.5H12m0-4.5H10.875a2.25 2.25 0 100 4.5H12m0 0v3"
            />
          </svg>
          <span>{baths} bath</span>
        </div>
  
        {/* Sqft */}
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 4.5l16.5 16.5m0-16.5L3.75 21"
            />
          </svg>
          <span>{size} sqm</span>
        </div>
      </div>
    );
}