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

  // Set page title
  useEffect(() => {
    document.title = 'Buy Properties | Ingwe | The Property Company';
  }, []);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const PAGE_SIZE = 12; // Number of properties to load per page
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
    listing_type: "For Sale" as string | undefined,
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
          listing_type: "For Sale", // Filter for properties for sale
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
    setLoading(true);
    // Reset pagination and clear properties when doing a new search
    setOffset(0);
    setProperties([]);

    // IMPORTANT: Double-check the location parameter
    // This ensures we're properly filtering by location
    if (searchParams.location) {
      console.log(`BuyPage - LOCATION FILTER IS SET: ${searchParams.location}`);
    } else {
      console.log(`BuyPage - NO LOCATION FILTER`);
    }

    // Log the search parameters for debugging
    console.log("🏠 BuyPage - Received search params from filter:", JSON.stringify(searchParams, null, 2));
    console.log("🏠 BuyPage - Executing search with params:", {
      location: searchParams.location || 'undefined',
      property_type: searchParams.property_type || 'undefined',
      min_price: searchParams.min_price || 'undefined',
      max_price: searchParams.max_price || 'undefined',
      bedrooms: searchParams.bedrooms || 'undefined',
      site: searchParams.site || 'undefined',
      listing_type: "For Sale",
    });

    try {
      // Created fixed parameters for the search
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
        site: searchParams.site || 217, // Use the site filter from state, default to 217
        listing_type: searchParams.listing_type || "For Sale", // Use provided listing_type or default to "For Sale"
      };

      // Log the FINAL parameters we're sending
      console.log("BuyPage - FINAL SEARCH PARAMETERS:", JSON.stringify(searchParameters));

      // Make sure to pass ALL parameters, especially location
      const apiProperties = await get_formatted_properties(searchParameters);

      console.log(`BuyPage - Search returned ${apiProperties.length} properties`);
      setProperties(apiProperties);
      setOffset(PAGE_SIZE); // Set offset for next page
      setHasMore(apiProperties.length === PAGE_SIZE); // If we got less than a full page, there's no more data
    } catch (error) {
      // If API fails, show empty state
      console.error("BuyPage - Search error:", error);
      setProperties([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    // Store the filters but don't trigger a search yet
    const updatedParams = {
      ...searchParams,
      ...filters
    };

    setSearchParams(updatedParams);

    // Always log the updates for debugging
    console.log("BuyPage - Updated search params:", updatedParams);
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
        listing_type: searchParams.listing_type || "For Sale",
      };

      console.log(`BuyPage - Loading more properties with offset: ${offset}`);

      const moreProperties = await get_formatted_properties(searchParameters);

      console.log(`BuyPage - Loaded ${moreProperties.length} more properties`);

      // Append the new properties to the existing list
      setProperties(prevProperties => [...prevProperties, ...moreProperties]);

      // Update offset for next page
      setOffset(prevOffset => prevOffset + PAGE_SIZE);

      // Check if there are more properties to load
      setHasMore(moreProperties.length === PAGE_SIZE);
    } catch (error) {
      console.error("BuyPage - Error loading more properties:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-8 w-full">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">Property for Sale</h1>
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
            listingType="buy"
            onLoadMore={loadMoreProperties}
            hasMore={hasMore}
            loading={loadingMore}
          />
        </div>
      )}
    </main>
  );
}
