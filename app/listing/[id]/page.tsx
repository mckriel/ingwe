"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyHeader from "@/app/ui/component/listing/property-header";
import PropertyGallery from "@/app/ui/component/listing/property-gallery";
import PropertyQuickStats from "@/app/ui/component/listing/property-quick-stats";
import PropertyDescription from "@/app/ui/component/listing/property-description";
import PropertyFeatures from "@/app/ui/component/listing/property-features";
import PropertySidePanel from "@/app/ui/component/listing/property-side-panel";
import PropertyImageGallery from "@/app/ui/component/listing/property-image-gallery";
import OtherListings from "@/app/ui/component/listing/other-listings";
import NavigationBar from "@/app/ui/component/header/top-navigation-bar/navigation-bar";
import { get_listing_details, get_formatted_properties, get_agent_details } from "@/app/actions/property-actions";
import { getLocationById } from "@/app/actions/preload-data";
import { propertyCache, cacheKeys } from "@/lib/cache";

export default function Page() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // We use this to ensure we're only rendering after client-side hydration
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        
        // First, try to fetch the property directly from the API
        try {
          // Check cache first
          const cacheKey = cacheKeys.propertyDetails(propertyId);
          let propertyData = propertyCache.get(cacheKey);
          
          if (!propertyData) {
            // Fetch the specific property by ID
            propertyData = await get_listing_details(propertyId);
            
            // Cache for 5 minutes
            if (propertyData) {
              propertyCache.set(cacheKey, propertyData, 300);
            }
          }
          
          // Process the property data
          if (propertyData) {
            const typedPropertyData = propertyData as any;
            // Fetch full agent details if we have an agent ID
            let agent_details = null;
            if (typedPropertyData.agent && typeof typedPropertyData.agent === 'number') {
              const agentCacheKey = cacheKeys.agentDetails(typedPropertyData.agent);
              agent_details = propertyCache.get(agentCacheKey);
              
              if (!agent_details) {
                agent_details = await get_agent_details(typedPropertyData.agent);
                if (agent_details) {
                  // Cache agent details for 10 minutes
                  propertyCache.set(agentCacheKey, agent_details, 600);
                }
              }
            }
            // Extract property features
            const property_features = [];
            
            // Boolean features
            if (typedPropertyData.pets_allowed) property_features.push("Pet Friendly");
            if (typedPropertyData.pool) property_features.push("Swimming Pool");
            if (typedPropertyData.security) property_features.push("Security");
            if (typedPropertyData.borehole) property_features.push("Borehole");
            if (typedPropertyData.solar_geyser) property_features.push("Solar Geyser");
            if (typedPropertyData.solar_panel) property_features.push("Solar Panels");
            if (typedPropertyData.gas_geyser) property_features.push("Gas Geyser");
            if (typedPropertyData.backup_battery_inverter) property_features.push("Backup Battery/Inverter");
            
            // Numeric features (only show if > 0)
            if (parseFloat(typedPropertyData.balcony || "0") > 0) property_features.push("Balcony");
            if (parseFloat(typedPropertyData.patio || "0") > 0) property_features.push("Patio");
            if (parseFloat(typedPropertyData.flatlet || "0") > 0) property_features.push("Flatlet");
            if (parseFloat(typedPropertyData.study || "0") > 0) property_features.push("Study");
            if (parseFloat(typedPropertyData.garages || "0") > 0) {
              const garage_count = parseInt(typedPropertyData.garages);
              property_features.push(`${garage_count} Garage${garage_count !== 1 ? 's' : ''}`);
            }
            if (parseFloat(typedPropertyData.carports || "0") > 0) {
              const carport_count = parseInt(typedPropertyData.carports);
              property_features.push(`${carport_count} Carport${carport_count !== 1 ? 's' : ''}`);
            }
            
            // Array features
            if (typedPropertyData.exterior && typedPropertyData.exterior.length > 0) {
              typedPropertyData.exterior.forEach((item: string) => property_features.push(item));
            }
            if (typedPropertyData.flooring && typedPropertyData.flooring.length > 0) {
              typedPropertyData.flooring.forEach((item: string) => property_features.push(`${item} Flooring`));
            }
            if (typedPropertyData.roof && typedPropertyData.roof.length > 0) {
              typedPropertyData.roof.forEach((item: string) => property_features.push(`${item} Roof`));
            }
            if (typedPropertyData.walling && typedPropertyData.walling.length > 0) {
              typedPropertyData.walling.forEach((item: string) => property_features.push(item));
            }
            // Try to get location details
            let locationInfo = "";
            
            // If the location is a number ID, fetch the location details
            if (typedPropertyData.location && (typeof typedPropertyData.location === 'number' || !isNaN(Number(typedPropertyData.location)))) {
              try {
                const locationData = await getLocationById(typedPropertyData.location);
                if (locationData) {
                  if (locationData.suburb && locationData.area) {
                    locationInfo = `${locationData.suburb}, ${locationData.area}`;
                  } else if (locationData.area) {
                    locationInfo = locationData.area;
                  } else if (locationData.suburb) {
                    locationInfo = locationData.suburb;
                  } else if (locationData.province) {
                    locationInfo = locationData.province;
                  }
                }
              } catch (error) {
                // Silently fail, we'll fall back to defaults
              }
            }
            
            const propertyObject = {
              id: typedPropertyData.id,
              title: typedPropertyData.marketing_heading && typedPropertyData.marketing_heading.trim() !== ""
                ? typedPropertyData.marketing_heading
                : typedPropertyData.heading
                  ? typedPropertyData.heading
                  : typedPropertyData.property_type 
                    ? `${typedPropertyData.property_type} in ${typedPropertyData.location || 'Unknown Location'}`
                    : `Property in ${typedPropertyData.location || 'Unknown Location'}`,
              location: typedPropertyData.location || "Unknown Location",
              locationString: typedPropertyData.locationString || locationInfo || (typeof typedPropertyData.location === 'string' && isNaN(Number(typedPropertyData.location)) ? typedPropertyData.location : "Unknown Location"),
              price: typedPropertyData.price || 0,
              // Use the processed image URLs from the API helper if available
              images: typedPropertyData.processed_image_urls || 
                // Fallback to our own processing logic if needed
                (Array.isArray(typedPropertyData.listing_images) && typedPropertyData.listing_images.length > 0
                  ? typedPropertyData.listing_images.map((img: any) => {
                      // If it's an object, try to get the URL
                      if (typeof img === 'object' && img !== null) {
                        // Look for standard URL fields
                        if (img.file && img.file.trim() !== "") return img.file;
                        if (img.url && img.url.trim() !== "") return img.url;
                        if (img.image_url && img.image_url.trim() !== "") return img.image_url;
                        
                        // If no standard fields, look for any field that might be a URL
                        const possibleUrlField = Object.entries(img).find(([key, value]) => 
                          typeof value === 'string' && 
                          value.trim() !== "" && 
                          (key.includes('url') || key.includes('file') || key.includes('image'))
                        );
                        
                        if (possibleUrlField) return possibleUrlField[1];
                      }
                      
                      // We might need to construct a URL from an ID
                      if (typeof img === 'number') {
                        // Pending: If we find a pattern for image ID to URL conversion
                      }
                      
                      // If we got here, we couldn't extract a URL
                      return null;
                    }).filter(Boolean).filter((url: string) => url && url.trim() !== "")
                  : []),
              beds: Number(typedPropertyData.bedrooms) || 0,
              baths: Number(typedPropertyData.bathrooms) || 0,
              size: typedPropertyData.floor_size ? Number(typedPropertyData.floor_size) : 0,
              description: typedPropertyData.description || "No description available.",
              features: property_features,
              // Use full agent details if available, otherwise fall back to meta.agent
              agent: {
                name: agent_details?.full_name || typedPropertyData.meta?.agent?.full_name || "Contact Agent",
                image: agent_details?.image_url || "",
                contact: agent_details?.email || agent_details?.cell_number || typedPropertyData.meta?.agent?.email || "info@ingwe.co.za",
                email: agent_details?.email || typedPropertyData.meta?.agent?.email || "info@ingwe.co.za",
              },
            };

            setProperty(propertyObject);
            
            // Set dynamic page title
            document.title = `${propertyObject.title} | Ingwe | The Property Company`;
            
            setUsingFallback(false);
          }
        } catch (apiError) {
          // Error handled in catch block
          
          // If direct API fetch fails, try to get the property from listings
          try {
            setUsingFallback(true);
            
            // Fetch properties and look for the one with the matching ID
            const allProperties = await get_formatted_properties({
              limit: 50, // Fetch enough properties to increase the chance of finding the one we need
              site: 217, // Filter for Ingwe properties
              include_full_description: true,
            });
            
            // Find the property with the matching ID
            const matchingProperty = allProperties.find((p: any) => 
              p.id.toString() === propertyId || p.propertyId?.toString() === propertyId
            );
            
            if (matchingProperty) {
              
              // Format the property data from listings
              const fallbackProperty = {
                id: matchingProperty.id,
                title: matchingProperty.title,
                location: matchingProperty.location || "Unknown Location",
                locationString: matchingProperty.locationString || (typeof matchingProperty.location === 'string' && isNaN(Number(matchingProperty.location)) ? matchingProperty.location : "Unknown Location"),
                price: matchingProperty.price,
                images: matchingProperty.image && !matchingProperty.image.includes('/house1.jpeg') ? [matchingProperty.image] : [],
                beds: matchingProperty.beds || 0,
                baths: matchingProperty.baths || 0,
                size: matchingProperty.size || 0,
                description: matchingProperty.description || "No description available.",
                features: [matchingProperty.propertyType || "Unknown property type"],
                agent: {
                  name: "Contact Agent",
                  image: "", // No fallback image for agent
                  contact: "info@ingwe.co.za",
                },
              };

              setProperty(fallbackProperty);
              
              // Set dynamic page title
              document.title = `${fallbackProperty.title} | Ingwe | The Property Company`;
            } else {
              // If we can't find the property in listings, show an error
              setError("Property not found");
            }
          } catch (listingError) {
            // Set error message
            setError("Failed to load property details");
          }
        }
      } catch (err) {
        // Set error message
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId && isClient) {
      fetchPropertyDetails();
    }
  }, [propertyId, isClient]);

  // If not yet client-side, return a simple loading state to avoid hydration errors
  if (!isClient) {
    return (
      <div className="max-w-screen-xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Now we're client-side, so we can render more complex loading state
  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 w-full max-w-lg bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-screen-xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-700">{error || "Property not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom Navigation Bar for Property Page */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <NavigationBar property={property} />
      </div>
      
      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        <main className="max-w-screen-xl mx-auto p-4 text-left mb-20">
      {usingFallback && !property.description && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-700">
          <p>Using limited property data. Some details may not be available.</p>
        </div>
      )}
    
      {/* Gallery - only show if we have real images */}
      {property.images && property.images.length > 0 && (
        <PropertyGallery 
          images={property.images} 
          title={property.title} 
        />
      )}

      {/* Main Content Layout: Property Info (2/3) + Agent Box (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Header */}
          <PropertyHeader 
            title={property.title} 
            location={property.locationString || 
              (typeof property.location === 'string' && isNaN(Number(property.location)) ? 
                property.location : "Unknown Location")} 
          />
          {/* Quick Stats */}
          <PropertyQuickStats beds={property.beds} baths={property.baths} size={property.size} />

          {/* Description */}
          <PropertyDescription description={property.description} />

          {/* Features */}
          <PropertyFeatures features={property.features} />
        </div>
        <div>
          <PropertySidePanel price={property.price} agent={property.agent} />
        </div>
      </div>

      {/* Image Gallery Below - only show if not using fallback */}
      {!usingFallback && property.images && property.images.length > 0 && (
        <PropertyImageGallery 
          images={property.images} 
        />
      )}

      {/* Other Listings Section */}
      <OtherListings 
        current_property_id={property.id?.toString()} 
        location={property.location}
      />
        </main>
      </div>
    </>
  );
}