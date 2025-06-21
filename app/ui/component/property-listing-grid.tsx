"use client";
import React, { useEffect, useCallback } from "react";
import PropertyCard from "@/app/ui/component/property-card";

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  size: number;
  propertyId?: number;
  description?: string;
  reference?: string;
  propertyType?: string;
  location?: string | number;
  locationString?: string;
  locationDetail?: any;
  site?: number;
}

interface PropertyListingGridProps {
  properties: Property[];
  title?: string; // Optional title for the grid
  listingType?: "buy" | "rent"; // Indicates whether these are properties for sale or rent
  onLoadMore?: () => void; // Callback to load more properties
  hasMore?: boolean; // Indicates if there are more properties to load
  loading?: boolean; // Indicates if properties are currently loading
}

export default function PropertyListingGrid({
  properties,
  title,
  listingType,
  onLoadMore,
  hasMore = false,
  loading = false
}: PropertyListingGridProps) {

  // Function to handle scroll events for infinite loading
  const handleScroll = useCallback(() => {
    // Early return if no more data or already loading
    if (!hasMore || loading || !onLoadMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // If we're near the bottom of the page (200px threshold)
    if (scrollHeight - scrollTop - clientHeight < 200) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  // Add scroll event listener when component mounts
  useEffect(() => {
    if (onLoadMore) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [onLoadMore, hasMore, loading, handleScroll]);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      {/* If no properties, show a message */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="h-full">
                <PropertyCard
                  id={property.id}
                  propertyId={property.propertyId}
                  image={property.image}
                  title={property.title}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  size={property.size}
                  propertyType={listingType === "rent" ? "To Let" : "For Sale"}
                  location={property.location}
                  locationString={property.locationString}
                  locationDetail={property.locationDetail}
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <h3 className="text-xl text-gray-500">No properties found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
      </div>

      {/* Load More Button */}
      {hasMore && properties.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-[#A3D92D] text-white rounded-full hover:bg-[#92c428] transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Properties'}
          </button>
        </div>
      )}

      {/* Loading indicator when scrolling */}
      {loading && hasMore && (
        <div className="flex justify-center mt-4 mb-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-3 w-3 bg-[#A3D92D] rounded-full"></div>
            <div className="h-3 w-3 bg-[#A3D92D] rounded-full"></div>
            <div className="h-3 w-3 bg-[#A3D92D] rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
