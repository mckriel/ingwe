"use client";

import { useState, useEffect } from "react";
import PropertyFilterBar from "@/app/ui/component/property-filter-bar";
import PropertyListingGrid from "@/app/ui/component/property-listing-grid";
import { get_formatted_properties } from "@/app/actions/property-actions";

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
}

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState({
    location: "",
    location_display: undefined as string | undefined,
    location_suburb: undefined as string | undefined,
    location_area: undefined as string | undefined,
    location_province: undefined as string | undefined,
    property_type: "",
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    bedrooms: undefined as number | undefined,
    listing_type: "To Let" as string | undefined,
    site: 217 as number | undefined, // Default to filtering for Ingwe properties by site ID
  });

  // Fetch properties when the page loads - only once
  useEffect(() => {
    // Only fetch data when the component first mounts
    const initialLoad = async () => {
      setLoading(true);
      try {
        // Use the site parameter from searchParams
        const apiProperties = await get_formatted_properties({ 
          limit: 6, // Reduced from 12 to 6 for initial load
          site: searchParams.site, // Use the site filter from state
          listing_type: "To Let", // Filter for rental properties
        });
        setProperties(apiProperties);
      } catch (error) {
          // Fallback to empty array
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    
    initialLoad();
    // Empty dependency array ensures this only runs once on mount
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const apiProperties = await get_formatted_properties({
        limit: 12,
        location: searchParams.location || undefined,
        location_display: searchParams.location_display || undefined,
        location_suburb: searchParams.location_suburb || undefined,
        location_area: searchParams.location_area || undefined,
        location_province: searchParams.location_province || undefined,
        property_type: searchParams.property_type || undefined,
        min_price: searchParams.min_price,
        max_price: searchParams.max_price,
        bedrooms: searchParams.bedrooms,
        site: searchParams.site, // Use the site filter from state
        listing_type: "To Let", // Filter for rental properties
      });
      
      setProperties(apiProperties);
    } catch (error) {
      // If API fails, show empty state
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    // Store the filters but don't trigger a search yet
    setSearchParams({
      ...searchParams,
      ...filters
    });
    
    // If there are console logs, you can uncomment this to see the filters
    // console.log("Updated search params:", { ...searchParams, ...filters });
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">Property for Rent</h1>
      <PropertyFilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      {loading ? (
        <div className="py-20">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <PropertyListingGrid 
            properties={properties} 
            listingType="rent"
          />
        </div>
      )}
    </main>
  );
}