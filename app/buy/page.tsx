"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function BuyPageContent() {
  const urlSearchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

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

  // Read URL parameters and update search state
  useEffect(() => {
    
    const urlParams = {
      location: urlSearchParams.get('location') || "",
      location_display: urlSearchParams.get('location_display') || undefined,
      location_suburb: urlSearchParams.get('location_suburb') || undefined,
      location_area: urlSearchParams.get('location_area') || undefined,
      location_province: urlSearchParams.get('location_province') || undefined,
      property_type: urlSearchParams.get('property_type') || "",
      min_price: urlSearchParams.get('min_price') ? parseInt(urlSearchParams.get('min_price')!) : undefined,
      max_price: urlSearchParams.get('max_price') ? parseInt(urlSearchParams.get('max_price')!) : undefined,
      bedrooms: urlSearchParams.get('bedrooms') ? parseInt(urlSearchParams.get('bedrooms')!) : undefined,
      bathrooms: urlSearchParams.get('bathrooms') ? parseInt(urlSearchParams.get('bathrooms')!) : undefined,
      listing_type: urlSearchParams.get('listing_type') || "For Sale",
      site: urlSearchParams.get('site') ? parseInt(urlSearchParams.get('site')!) : 217,
    };

    // Update search params state
    setSearchParams(urlParams);
    
    // Mark that we've processed the URL parameters
    setInitialLoadComplete(true);
  }, [urlSearchParams]);

  // Fetch properties when URL parameters are loaded
  useEffect(() => {
    if (!initialLoadComplete) return; // Wait for URL params to be processed
    
    const performInitialSearch = async () => {
      setLoading(true);
      setOffset(0);
      setProperties([]);
      
      try {
        // Check if we have any filters from URL (excluding default values)
        const hasFilters = searchParams.location || 
                          searchParams.property_type || 
                          searchParams.min_price || 
                          searchParams.max_price || 
                          searchParams.bedrooms || 
                          searchParams.bathrooms;
        
        const apiProperties = await get_formatted_properties({
          limit: PAGE_SIZE,
          offset: 0,
          location: searchParams.location || undefined,
          location_display: searchParams.location_display,
          location_suburb: searchParams.location_suburb,
          location_area: searchParams.location_area,
          location_province: searchParams.location_province,
          property_type: searchParams.property_type || undefined,
          min_price: searchParams.min_price,
          max_price: searchParams.max_price,
          bedrooms: searchParams.bedrooms,
          bathrooms: searchParams.bathrooms,
          listing_type: searchParams.listing_type,
          site: searchParams.site,
        });
        
        setProperties(apiProperties);
        setOffset(PAGE_SIZE);
        setHasMore(apiProperties.length === PAGE_SIZE);
      } catch (error) {
        console.error("Buy page: Initial search error:", error);
        setProperties([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    performInitialSearch();
  }, [initialLoadComplete, searchParams]);

  const handleSearch = async () => {
    setLoading(true);
    // Reset pagination and clear properties when doing a new search
    setOffset(0);
    setProperties([]);


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
    const updatedParams = {
      ...searchParams,
      ...filters
    };

    setSearchParams(updatedParams);
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

      const moreProperties = await get_formatted_properties(searchParameters);

      // Append the new properties to the existing list
      setProperties(prevProperties => [...prevProperties, ...moreProperties]);

      // Update offset for next page
      setOffset(prevOffset => prevOffset + PAGE_SIZE);

      // Check if there are more properties to load
      setHasMore(moreProperties.length === PAGE_SIZE);
    } catch (error) {
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
        initialValues={searchParams}
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

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent pt-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-[#B8C332] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <BuyPageContent />
    </Suspense>
  );
}
