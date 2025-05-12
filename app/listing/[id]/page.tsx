"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PropertyHeader from "@/app/ui/component/listing/property-header";
import PropertyGallery from "@/app/ui/component/listing/property-gallery";
import PropertyQuickStats from "@/app/ui/component/listing/property-quick-stats";
import PropertyDescription from "@/app/ui/component/listing/property-description";
import PropertyFeatures from "@/app/ui/component/listing/property-features";
import PropertySidePanel from "@/app/ui/component/listing/property-side-panel";
import PropertyImageGallery from "@/app/ui/component/listing/property-image-gallery";
import { get_listing_details, get_formatted_properties } from "@/app/actions/property-actions";

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
          // Fetch the specific property by ID
          const propertyData = await get_listing_details(propertyId);
          
          // Process the property data
          if (propertyData) {
            setProperty({
              id: propertyData.id,
              title: propertyData.marketing_heading && propertyData.marketing_heading.trim() !== ""
                ? propertyData.marketing_heading
                : propertyData.heading
                  ? propertyData.heading
                  : propertyData.property_type 
                    ? `${propertyData.property_type} in ${propertyData.location || 'Unknown Location'}`
                    : `Property in ${propertyData.location || 'Unknown Location'}`,
              location: propertyData.location || "Unknown Location",
              price: propertyData.price || 0,
              // Use the processed image URLs from the API helper if available
              images: propertyData.processed_image_urls || 
                // Fallback to our own processing logic if needed
                (Array.isArray(propertyData.listing_images) && propertyData.listing_images.length > 0
                  ? propertyData.listing_images.map((img: any) => {
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
                  : ["/house1.jpeg"]),
              beds: Number(propertyData.bedrooms) || 0,
              baths: Number(propertyData.bathrooms) || 0,
              size: propertyData.floor_size ? Number(propertyData.floor_size) : 0,
              description: propertyData.description || "No description available.",
              features: ["Property ID: " + propertyData.id, propertyData.property_type],
              // Based on the logs, agent is sometimes a number (ID) rather than an object
              agent: {
                name: typeof propertyData.agent === 'object' ? propertyData.agent?.name || "Contact Agent" : "Contact Agent",
                image: (typeof propertyData.agent === 'object' && propertyData.agent?.image && propertyData.agent?.image.trim() !== "") 
                  ? propertyData.agent.image 
                  : "/house1.jpeg",
                contact: typeof propertyData.agent === 'object' ? propertyData.agent?.contact || "info@ingwe.co.za" : "info@ingwe.co.za",
              },
            });
            
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
              setProperty({
                id: matchingProperty.id,
                title: matchingProperty.title,
                location: matchingProperty.location || "Unknown Location",
                price: matchingProperty.price,
                images: matchingProperty.image ? [matchingProperty.image] : ["/house1.jpeg"],
                beds: matchingProperty.beds || 0,
                baths: matchingProperty.baths || 0,
                size: matchingProperty.size || 0,
                description: matchingProperty.description || "No description available.",
                features: [
                  matchingProperty.reference ? `Reference: ${matchingProperty.reference}` : "No reference available",
                  matchingProperty.propertyType || "Unknown property type"
                ],
                agent: {
                  name: "Contact Agent",
                  image: "/house1.jpeg",
                  contact: "info@ingwe.co.za",
                },
              });
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
    <main className="max-w-screen-xl mx-auto p-4 text-left">
      {usingFallback && !property.description && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-700">
          <p>Using limited property data. Some details may not be available.</p>
        </div>
      )}
    
      {/* Header */}
      <PropertyHeader title={property.title} location={property.location} />

      {/* Gallery */}
      <PropertyGallery 
        images={property.images && property.images.length > 0 
          ? property.images 
          : ["/house1.jpeg"]} // Fallback image
        title={property.title} 
      />

      {/* Quick Stats */}
      <PropertyQuickStats beds={property.beds} baths={property.baths} size={property.size} />

      {/* Description */}
      <PropertyDescription description={property.description} />

      {/* Features */}
      <PropertyFeatures features={property.features} />

      {/* Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Other main content could go here */}
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

      {/* Similar listings section removed for now */}
    </main>
  );
}