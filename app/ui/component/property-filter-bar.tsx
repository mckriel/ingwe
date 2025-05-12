"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getLocationSuggestions, prefetchCommonLocationTerms } from "@/app/actions/location-handler";

interface propertyFilterBarProps {
  onSearch: () => void;
  onFilterChange?: (filters: {
    location?: string;
    location_display?: string;
    location_suburb?: string;
    location_area?: string;
    location_province?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    listing_type?: string;
    site?: number; // Added site ID for company filtering
  }) => void;
}

interface LocationSuggestion {
  id: number;
  display: string;
  area: string;
  suburb: string;
  province: string;
  full: any;
}

export default function PropertyFilterBar({ onSearch, onFilterChange = () => {} }: propertyFilterBarProps) {
  // State for search inputs
  const [locationInput, setLocationInput] = useState("");
  const [locations, setLocations] = useState<{id: number, display: string, suburb?: string, area?: string, province?: string}[]>([]);
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [listingType, setListingType] = useState<string>("buy"); // buy, rent, sell
  // State for location suggestions
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference for the suggestion dropdown
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  let heading_text = "Find Property for Sale";
  if (pathname === "/rent") heading_text = "Find Property for Rent";
  else if (pathname === "/buy") heading_text = "Find Property for Sale";

  // Fetch location suggestions when input changes
  useEffect(() => {
    let isMounted = true;
    const fetchSuggestions = async () => {
      if (locationInput.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Use client-side caching logic
        const results = await getLocationSuggestions(locationInput);
        if (isMounted) {
          setSuggestions(results);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        if (isMounted) {
          setSuggestions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Debounce the API call to avoid making too many requests
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [locationInput]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Don't automatically update on filter changes
  // Instead, prepare the filters for when the search button is clicked
  const getFilterParams = () => {
    // For location filtering
    // After testing, we found that API requires the location ID to be a single ID 
    // For now, we'll just use the first selected location if any
    const locationId = locations.length > 0 ? locations[0].id : undefined;

    // Convert price strings to numbers
    let minPriceNum = undefined;
    let maxPriceNum = undefined;
    let bedroomsNum = undefined;
    
    if (minPrice && minPrice !== "Min Price") {
      minPriceNum = parseInt(minPrice.replace(/\D/g, ''));
    }
    
    if (maxPrice && maxPrice !== "Max Price") {
      maxPriceNum = parseInt(maxPrice.replace(/\D/g, ''));
    }
    
    if (bedrooms && bedrooms !== "Bedrooms") {
      bedroomsNum = parseInt(bedrooms);
    }
    
    // Always filter for Ingwe properties (site ID 217)
    const siteFilter = 217;
    
    // Enhanced debugging - always log the search parameters
    console.log("PropertyFilterBar - Search parameters:", {
      locationId: locationId,
      selectedLocations: locations,
      property_type: propertyType !== "Property Type" ? propertyType : undefined,
      min_price: minPriceNum,
      max_price: maxPriceNum,
      bedrooms: bedroomsNum,
      site: siteFilter
    });
    
    return {
      location: locationId ? locationId.toString() : undefined,
      property_type: propertyType !== "Property Type" ? propertyType : undefined,
      min_price: minPriceNum,
      max_price: maxPriceNum,
      bedrooms: bedroomsNum,
      site: siteFilter, // Add site filter for Ingwe properties
      listing_type: listingType === "buy" ? "For Sale" : listingType === "rent" ? "To Let" : undefined
    };
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    // Add to selected locations if not already present
    if (!locations.some(loc => loc.id === suggestion.id)) {
      // Add to selected locations
      const newLocations = [...locations, { 
        id: suggestion.id, 
        display: suggestion.display,
        suburb: suggestion.suburb,
        area: suggestion.area,
        province: suggestion.province
      }];
      setLocations(newLocations);
      
      // Immediately update parent component with the new location 
      const locationId = suggestion.id;
      console.log("Location selected:", locationId, suggestion.display);
      
      // Store both ID and text information for the location
      // This allows us to search by name if ID doesn't find matches
      const filterParams = {
        location: locationId.toString(),
        location_display: suggestion.display,
        location_suburb: suggestion.suburb || "",
        location_area: suggestion.area || "",
        location_province: suggestion.province || ""
      };
      
      // Update parent component's filters
      onFilterChange(filterParams);
    }
    setLocationInput("");
    setShowSuggestions(false);
  };

  const removeLocation = (locId: number) => {
    // Remove the location from our local state
    const newLocations = locations.filter(loc => loc.id !== locId);
    setLocations(newLocations);
    
    // Determine what location ID to use now (if any)
    const newLocationId = newLocations.length > 0 ? newLocations[0].id : undefined;
    
    console.log("Location removed. New active location:", 
      newLocationId ? `${newLocationId} (${newLocations[0].display})` : "None");
    
    // Update parent component with the new location state
    if (newLocationId) {
      const selectedLocation = newLocations[0];
      onFilterChange({
        location: newLocationId.toString(),
        location_display: selectedLocation.display,
        location_suburb: selectedLocation.suburb || "",
        location_area: selectedLocation.area || "",
        location_province: selectedLocation.province || ""
      });
    } else {
      // Clear all location parameters
      onFilterChange({
        location: undefined,
        location_display: undefined,
        location_suburb: undefined,
        location_area: undefined,
        location_province: undefined
      });
    }
  };


  return (
    <div className="bg-white p-4 rounded-lg w-full max-w-screen-lg mx-auto">
      {/* Buy/Rent/Sell Toggle - Now above the location search */}
      <div className="mb-6">
        <div className="inline-flex border-b w-full">
          <button
            className={`py-3 px-10 font-medium text-base ${
              listingType === "buy" 
                ? "text-gray-800 border-b-4 border-[#D1DA68] font-bold" 
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setListingType("buy")}
          >
            Buying
          </button>
          <button
            className={`py-3 px-10 font-medium text-base ${
              listingType === "rent" 
                ? "text-gray-800 border-b-4 border-[#D1DA68] font-bold" 
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setListingType("rent")}
          >
            Renting
          </button>
          <button
            className={`py-3 px-10 font-medium text-base ${
              listingType === "sell" 
                ? "text-gray-800 border-b-4 border-[#D1DA68] font-bold" 
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setListingType("sell")}
          >
            Selling
          </button>
        </div>
      </div>

      {/* Location Search Row */}
      <div className="mb-8">
        <div className="relative w-full" ref={suggestionsRef}>
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for location..."
                className="border border-gray-300 rounded-full px-4 py-3 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => {
                  // Prefetch common locations when the user focuses the input
                  prefetchCommonLocationTerms();
                  // Show suggestions if we have a valid query
                  if (locationInput.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
              />
              {/* Search icon */}
              <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Location suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute z-30 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {isLoading ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2 flex items-center"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="mr-2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {suggestion.display}
                    </div>
                  ))}
                </>
              ) : locationInput.trim().length >= 2 ? (
                <div className="px-4 py-2 text-gray-500">No locations found</div>
              ) : null}
            </div>
          )}
        </div>
        
        {/* Selected locations */}
        {locations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {locations.map((loc, index) => (
              <div
                key={loc.id}
                className={`${index === 0 ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700'} flex items-center gap-2 px-3 py-1 rounded-full shadow-sm`}
              >
                <span className="flex items-center">
                  {/* Location icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">
                    {loc.display}
                  </span>
                </span>
                <button 
                  onClick={() => removeLocation(loc.id)}
                  className="hover:bg-red-100 rounded-full p-1"
                  title="Remove this location"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-[#D1DA68]/20 rounded-full p-2 flex flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-between">
          <div className="w-full md:w-1/3 px-2 py-1">
            <div className="relative">
              <select 
                className="appearance-none bg-white w-full pl-3 pr-8 py-2 rounded-full text-sm focus:outline-none font-medium"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="" className={!propertyType ? "font-bold" : ""}>Property Type</option>
                <option value="House" className={propertyType === "House" ? "font-bold" : ""}>House</option>
                <option value="Apartment" className={propertyType === "Apartment" ? "font-bold" : ""}>Apartment</option>
                <option value="Townhouse" className={propertyType === "Townhouse" ? "font-bold" : ""}>Townhouse</option>
                <option value="Villa" className={propertyType === "Villa" ? "font-bold" : ""}>Villa</option>
                <option value="Duplex" className={propertyType === "Duplex" ? "font-bold" : ""}>Duplex</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 px-2 py-1">
            <div className="relative">
              <select 
                className="appearance-none bg-white w-full pl-3 pr-8 py-2 rounded-full text-sm focus:outline-none font-medium"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              >
                <option value="" className={!minPrice ? "font-bold" : ""}>Price</option>
                <option value="R500000" className={minPrice === "R500000" ? "font-bold" : ""}>R500,000</option>
                <option value="R1000000" className={minPrice === "R1000000" ? "font-bold" : ""}>R1,000,000</option>
                <option value="R2000000" className={minPrice === "R2000000" ? "font-bold" : ""}>R2,000,000</option>
                <option value="R3000000" className={minPrice === "R3000000" ? "font-bold" : ""}>R3,000,000</option>
                <option value="R5000000" className={minPrice === "R5000000" ? "font-bold" : ""}>R5,000,000</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 px-2 py-1">
            <div className="relative">
              <select 
                className="appearance-none bg-white w-full pl-3 pr-8 py-2 rounded-full text-sm focus:outline-none font-medium"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="" className={!bedrooms ? "font-bold" : ""}>Features</option>
                <option value="1" className={bedrooms === "1" ? "font-bold" : ""}>1+ Bed</option>
                <option value="2" className={bedrooms === "2" ? "font-bold" : ""}>2+ Beds</option>
                <option value="3" className={bedrooms === "3" ? "font-bold" : ""}>3+ Beds</option>
                <option value="4" className={bedrooms === "4" ? "font-bold" : ""}>4+ Beds</option>
                <option value="5" className={bedrooms === "5" ? "font-bold" : ""}>5+ Beds</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Button */}
        <div className="mt-2 md:mt-0 px-2">
          <button 
            className="w-full md:w-auto bg-[#D1DA68] hover:bg-[#D1DA68]/80 transition text-white px-6 py-2 rounded-full"
            onClick={() => {
              // Get all the filter parameters
              const filterParams = getFilterParams();
              
              // Double check the location ID is included if we have selected locations
              if (locations.length > 0 && !filterParams.location) {
                console.log("WARNING: Location ID was missing! Adding from selected locations:", locations[0].id);
                filterParams.location = locations[0].id.toString();
              }
              
              // Ensure we never use the entered text directly - must select from dropdown
              // Ignore any text that's still in the input box
              if (locationInput.trim().length > 0) {
                console.log("Ignoring unpicked location text:", locationInput);
              }
              
              // Log final search parameters
              console.log("Executing search with final parameters:", filterParams);
              
              // Pass the filter params to the parent component
              onFilterChange(filterParams);
              
              // Trigger the search
              onSearch();
            }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}