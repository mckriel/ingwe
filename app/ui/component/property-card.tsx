"use client";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  image: string;     // URL or path to the image
  title: string;     // e.g., "Standard Apartment"
  price: string;     // e.g., "R12,000 per month"
  beds: number;      // number of bedrooms
  baths: number;     // number of bathrooms
  size: number;      // square meters (m²)
  id?: number;       // property ID for linking to detail page
  propertyId?: number; // API property ID if different from id
  reference?: string; // Property reference code
  description?: string; // Property description
  propertyType?: string; // Type of property
  location?: string | number; // Location ID of the property
  locationString?: string; // Formatted location name (area, suburb)
  locationDetail?: any; // Full location object with details
  site?: number;     // Site ID (for company identification)
}

export default function PropertyCard({
  image,
  title,
  price,
  beds,
  baths,
  size,
  id = 123,
  propertyId,
  reference,
  description,
  propertyType,
  location,
  locationString,
  locationDetail,
  site,
}: PropertyCardProps) {
  // Simply use the property ID for a clean URL
  const propertyUrl = `/listing/${propertyId || id}`;
  
  // Check if this is a rental property based on the price format
  const isRental = price?.includes('per month') || price?.includes('p/m') || propertyType?.includes('Rental') || propertyType?.includes('To Let');

  return (
    <Link href={propertyUrl} className="block h-full">
      <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
        {/* Image Wrapper */}
        <div className="relative w-full h-56">
          <Image
            src={image && image.trim() !== "" ? image : "/house1.jpeg"} // Fallback to default image if none provided
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
            onError={(e) => {
              // Replace with fallback image on error
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = "/house1.jpeg";
            }}
          />
        </div>

        {/* Price directly under the image - doubled in size */}
        <div className="px-4 py-2">
          <span className="text-[#1e1e1e] font-bold text-2xl">
            {price}
            {isRental && <span className="text-base font-normal text-gray-500"> p/m</span>}
          </span>
        </div>

        {/* Info Section - Content area below image with reduced spacing */}
        <div className="px-4 pt-1 pb-4 flex-grow flex flex-col">
          {/* Area/Location with border underneath (full width) */}
          <div className="mb-3 pb-2 border-b -mx-4 px-4">
            <span className="text-[#1e1e1e] text-sm">
              {locationString || (locationDetail?.area ? (locationDetail.suburb ? `${locationDetail.suburb}, ${locationDetail.area}` : locationDetail.area) : (typeof location === 'number' || (typeof location === 'string' && !isNaN(Number(location))) ? "Unknown Location" : location))}
            </span>
          </div>

          {/* Features: bed, bath, sqm in a horizontal layout */}
          <div className="flex items-center justify-center gap-5 text-gray-700 text-sm">
            {/* Beds */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#D1DA68]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="13" width="16" height="5" rx="1" />
                <path d="M4 11V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2H4z" />
                <path d="M6 8V6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2H6z" />
              </svg>
              <span>{beds} bed</span>
            </div>

            {/* Baths */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#D1DA68]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 12h16a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 0 1 1-1z" />
                <path d="M6 12V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v6" />
              </svg>
              <span>{baths} bath</span>
            </div>

            {/* Size in square meters */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#D1DA68]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21H3V3h18v18zM9 5H5v4h4V5zm10 0h-4v4h4V5zM9 15H5v4h4v-4zm10 0h-4v4h4v-4z" />
              </svg>
              <span>{size} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
