"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { get_location_suggestions } from "@/app/actions/location-actions";
import { get_property_types, PropertyType } from "@/app/actions/property-types";

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
    bathrooms?: number;
    listing_type?: string;
    site?: number; // Added site ID for company filtering
  }) => void;
  showNavigationTabs?: boolean; // Show Buying/Renting/Selling tabs (for home page)
  searchType?: string; // Current search type (buying/renting/selling)
  onSearchTypeChange?: (type: string) => void; // Handler for search type change
}

interface LocationSuggestion {
  id: number;
  display: string;
  area: string;
  suburb: string;
  province: string;
  full: any;
}

export default function PropertyFilterBar({ 
  onSearch, 
  onFilterChange = () => {}, 
  showNavigationTabs = false,
  searchType = 'buying',
  onSearchTypeChange = () => {}
}: propertyFilterBarProps) {
  // State for search inputs
  const [locationInput, setLocationInput] = useState("");
  const [locations, setLocations] = useState<{id: number, display: string, suburb?: string, area?: string, province?: string}[]>([]);
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");
  const [listingType, setListingType] = useState<string>("buy"); // buy, rent
  // State for location suggestions
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for property types
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  
  // Reference for the suggestion dropdown
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  // Format price with commas
  const formatPrice = (value: string): string => {
    // Remove everything except digits
    const digits = value.replace(/\D/g, '');
    
    if (!digits) return '';
    
    // Add commas for thousands
    const formatted = parseInt(digits).toLocaleString();
    return `R${formatted}`;
  };

  // Extract numeric value from formatted price
  const extractPriceValue = (formattedPrice: string): number | undefined => {
    const digits = formattedPrice.replace(/\D/g, '');
    const result = digits ? parseInt(digits) : undefined;
    console.log("💵 extractPriceValue:", formattedPrice, "→", result);
    return result;
  };

  // Handle price input changes
  const handlePriceChange = (value: string, setPriceState: (value: string) => void) => {
    // If value is empty, keep it empty to show placeholder
    if (!value || value.trim() === '') {
      setPriceState('');
      return;
    }
    
    // Always ensure it starts with R when there's content
    if (!value.startsWith('R')) {
      value = 'R' + value.replace(/\D/g, '');
    }
    
    const formatted = formatPrice(value);
    setPriceState(formatted);
  };

  // Set the default listing type based on the current page
  useEffect(() => {
    if (pathname === "/rent") {
      setListingType("rent");
    } else if (pathname === "/buy") {
      setListingType("buy");
    }
  }, [pathname]);

  // Fetch property types when component mounts
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const types = await get_property_types();
        setPropertyTypes(types);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };

    fetchPropertyTypes();
  }, []);

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
        const results = await get_location_suggestions(locationInput);
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
    
    minPriceNum = extractPriceValue(minPrice);
    maxPriceNum = extractPriceValue(maxPrice);
    
    console.log("🔍 PropertyFilterBar getFilterParams - Price values:");
    console.log("  Raw minPrice:", minPrice, "→ Extracted:", minPriceNum);
    console.log("  Raw maxPrice:", maxPrice, "→ Extracted:", maxPriceNum);
    
    if (bedrooms && bedrooms !== "Bed") {
      bedroomsNum = parseInt(bedrooms);
    }
    
    let bathroomsNum = undefined;
    if (bathrooms && bathrooms !== "Bath") {
      bathroomsNum = parseInt(bathrooms);
    }
    
    // Always filter for Ingwe properties (site ID 217)
    const siteFilter = 217;
    
    // Enhanced debugging - always log the search parameters
    console.log("🚀 PropertyFilterBar - Final search parameters:", {
      locationId: locationId,
      selectedLocations: locations,
      property_type: propertyType !== "Property Type" ? propertyType : undefined,
      min_price: minPriceNum,
      max_price: maxPriceNum,
      bedrooms: bedroomsNum,
      bathrooms: bathroomsNum,
      site: siteFilter
    });
    
    return {
      location: locationId ? locationId.toString() : undefined,
      property_type: propertyType !== "Property Type" ? propertyType : undefined,
      min_price: minPriceNum,
      max_price: maxPriceNum,
      bedrooms: bedroomsNum,
      bathrooms: bathroomsNum,
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
    <div className="w-full max-w-screen-xl mx-auto px-4 mb-8">
      {/* Navigation Tabs Section - Only show on home page */}
      {showNavigationTabs && (
        <div className="bg-white px-6 py-3 mb-1">
          <div className="flex justify-start">
            <div className="flex items-center gap-6">
              <button
                onClick={() => onSearchTypeChange('buying')}
                className={`px-6 py-2 transition-all ${
                  searchType === 'buying' 
                  ? 'text-black font-bold border-b-2 border-[#B8C332]' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Buying
              </button>
              <button
                onClick={() => onSearchTypeChange('renting')}
                className={`px-6 py-2 transition-all ${
                  searchType === 'renting' 
                  ? 'text-black font-bold border-b-2 border-[#B8C332]' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Renting
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter box */}
      <div className="bg-[#B8C332] border border-gray-200 rounded-2xl p-6 shadow-lg">
        
        {/* Location Search */}
        <div className="mb-6">
          <div className="relative w-full" ref={suggestionsRef}>
            <input
              type="text"
              placeholder="Search for location..."
              className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onFocus={() => {
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
            
            {/* Location suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute z-30 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl border border-gray-200 py-1 text-base overflow-auto focus:outline-none sm:text-sm">
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
            <div className="mt-3 flex flex-wrap gap-2">
              {locations.map((loc, index) => (
                <div
                  key={loc.id}
                  className={`${index === 0 ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700'} flex items-center gap-2 px-3 py-1 rounded-full shadow-sm`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{loc.display}</span>
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

        {/* Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Property Type */}
          <div className="flex-1">
            <div className="relative">
              <select
                className={`appearance-none bg-gray-50 w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent ${propertyType === "" ? "text-gray-400" : "text-gray-900"}`}
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  onFilterChange({
                    property_type: e.target.value === "" ? undefined : e.target.value
                  });
                }}
              >
                <option value="">Property Type</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.display_name || type.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Min Price */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Min Price"
              className="bg-gray-50 w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
              value={minPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
            />
          </div>
          
          {/* Max Price */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Max Price"
              className="bg-gray-50 w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
            />
          </div>
          
          {/* Bedrooms */}
          <div className="flex-none w-32">
            <div className="relative">
              <select 
                className={`appearance-none bg-gray-50 w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent ${bedrooms === "" ? "text-gray-400" : "text-gray-900"}`}
                value={bedrooms}
                onChange={(e) => {
                  setBedrooms(e.target.value);
                  onFilterChange({
                    bedrooms: e.target.value === "" ? undefined : parseInt(e.target.value)
                  });
                }}
              >
                <option value="">Bed</option>
                <option value="1">1+ Bed</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option value="5">5+ Beds</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Bathrooms */}
          <div className="flex-none w-32">
            <div className="relative">
              <select 
                className={`appearance-none bg-gray-50 w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:border-transparent ${bathrooms === "" ? "text-gray-400" : "text-gray-900"}`}
                value={bathrooms}
                onChange={(e) => {
                  setBathrooms(e.target.value);
                  onFilterChange({
                    bathrooms: e.target.value === "" ? undefined : parseInt(e.target.value)
                  });
                }}
              >
                <option value="">Bath</option>
                <option value="1">1+ Bath</option>
                <option value="2">2+ Baths</option>
                <option value="3">3+ Baths</option>
                <option value="4">4+ Baths</option>
                <option value="5">5+ Baths</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="flex-shrink-0">
            <button 
              className="bg-white hover:bg-gray-100 text-[#B8C332] font-medium px-8 py-3 rounded-xl transition-colors duration-200 border border-white"
              onClick={() => {
                const filterParams = getFilterParams();
                
                if (locations.length > 0 && !filterParams.location) {
                  filterParams.location = locations[0].id.toString();
                }
                
                if (locationInput.trim().length > 0) {
                  console.log("Ignoring unpicked location text:", locationInput);
                }
                
                onFilterChange(filterParams);
                onSearch();
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}