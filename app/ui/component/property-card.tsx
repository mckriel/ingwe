"use client";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
  image: string;     // URL or path to the image
  title: string;     // e.g., "Standard Apartment"
  price: string;     // e.g., "R12,000 per month"
  beds: number;      // number of bedrooms
  baths: number;     // number of bathrooms
  sqft: number;      // square footage
}

export default function PropertyCard({
  image,
  title,
  price,
  beds,
  baths,
  sqft,
}: PropertyCardProps) {
  return (
    <Link href="/listing/123" className="block">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Image Wrapper */}
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
          />
          {/* Contact Agent Badge */}
          <div className="absolute top-2 left-2 bg-[#4B4B4B]/80 text-white px-3 py-1 rounded-full text-sm">
            Contact Agent
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-[#4B4B4B]">{title}</h2>
            <span className="text-[#4B4B4B] font-medium">{price}</span>
          </div>

          {/* Features: bed, bath, sqft */}
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            {/* Beds */}
            <div className="flex items-center gap-1">
              {/* Bed icon (optional) */}
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
              {/* Bath icon (optional) */}
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
              {/* Sqft icon (optional) */}
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
              <span>{sqft} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
