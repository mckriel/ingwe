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
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const PAGE_SIZE = 12; // Number of properties to load per page

  // Set page title
  useEffect(() => {
    document.title = 'Rent Properties | Ingwe | The Property Company';
  }, []);
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
    bathrooms: undefined as number | undefined,
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
          limit: PAGE_SIZE, // Load a full page initially
          offset: 0, // Start from the beginning
          site: searchParams.site, // Use the site filter from state
          listing_type: "To Let", // Filter for rental properties
        });
        setProperties(apiProperties);
        setOffset(PAGE_SIZE); // Set the offset for the next page
        setHasMore(apiProperties.length === PAGE_SIZE); // If we got less than a full page, there's no more data
      } catch (error) {
          // Fallback to empty array
        setProperties([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    
    initialLoad();
    // Empty dependency array ensures this only runs once on mount
  }, [PAGE_SIZE, searchParams.site]);

  const handleSearch = async () => {
    console.log("🏠 RentPage - Received search params from filter:", JSON.stringify(searchParams, null, 2));
    setLoading(true);
    setProperties([]);
    // Reset pagination when doing a new search
    setOffset(0);
    try {
      const searchParameters = {
        limit: PAGE_SIZE,
        offset: 0, // Start from the beginning for a new search
        location: searchParams.location || undefined,
        location_display: searchParams.location_display || undefined,
        location_suburb: searchParams.location_suburb || undefined,
        location_area: searchParams.location_area || undefined,
        location_province: searchParams.location_province || undefined,
        property_type: searchParams.property_type || undefined,
        min_price: searchParams.min_price,
        max_price: searchParams.max_price,
        bedrooms: searchParams.bedrooms,
        bathrooms: searchParams.bathrooms,
        site: searchParams.site, // Use the site filter from state
        listing_type: "To Let", // Filter for rental properties
      };
      
      console.log("🏠 RentPage - Final search parameters:", JSON.stringify(searchParameters, null, 2));
      const apiProperties = await get_formatted_properties(searchParameters);
      
      setProperties(apiProperties);
      setOffset(PAGE_SIZE); // Set offset for next page
      setHasMore(apiProperties.length === PAGE_SIZE); // If we got less than a full page, there's no more data
    } catch (error) {
      // If API fails, show empty state
      setProperties([]);
      setHasMore(false);
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

  // Function to load more properties when user scrolls to bottom or clicks "Load More"
  const loadMoreProperties = async () => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      // Use same parameters as the initial search, but with updated offset
      const searchParameters = {
        limit: PAGE_SIZE,
        offset: offset, // Use the current offset
        location: searchParams.location || undefined,
        location_display: searchParams.location_display || undefined,
        location_suburb: searchParams.location_suburb || undefined,
        location_area: searchParams.location_area || undefined,
        location_province: searchParams.location_province || undefined,
        property_type: searchParams.property_type || undefined,
        min_price: searchParams.min_price,
        max_price: searchParams.max_price,
        bedrooms: searchParams.bedrooms,
        bathrooms: searchParams.bathrooms,
        site: searchParams.site || 217,
        listing_type: "To Let",
      };

      console.log(`RentPage - Loading more properties with offset: ${offset}`);

      const moreProperties = await get_formatted_properties(searchParameters);

      console.log(`RentPage - Loaded ${moreProperties.length} more properties`);

      // Append the new properties to the existing list
      setProperties(prevProperties => [...prevProperties, ...moreProperties]);

      // Update offset for next page
      setOffset(prevOffset => prevOffset + PAGE_SIZE);

      // Check if there are more properties to load
      setHasMore(moreProperties.length === PAGE_SIZE);
    } catch (error) {
      console.error("RentPage - Error loading more properties:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-8 w-full">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">Property for Rent</h1>
      <PropertyFilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <div className="mt-8"></div>
      
      {loading ? (
        <div className="min-h-screen bg-transparent pt-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-[#B8C332] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <PropertyListingGrid 
            properties={properties} 
            listingType="rent"
            onLoadMore={loadMoreProperties}
            hasMore={hasMore}
            loading={loadingMore}
          />
        </div>
      )}
    </main>
  );
}