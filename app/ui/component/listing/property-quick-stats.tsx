import React from 'react';
import Image from 'next/image';

interface PropertyQuickStatsProps {
    beds: number;
    baths: number;
    size: number;
}

export default function PropertyQuickStats({ beds, baths, size }: PropertyQuickStatsProps) {
    return (
      <div className="flex items-center gap-6 mb-4 text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 relative">
            <Image
              src="/icons/bed.png"
              alt="Bedrooms"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium">{beds} bed{beds !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 relative">
            <Image
              src="/icons/bath.png"
              alt="Bathrooms"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium">{baths} bath{baths !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 relative">
            <Image
              src="/icons/size.png"
              alt="Size"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium">{size} sqm</span>
        </div>
      </div>
    );
}