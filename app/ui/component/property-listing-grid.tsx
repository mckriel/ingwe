"use client";
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
}

export default function PropertyListingGrid({ properties, title, listingType }: PropertyListingGridProps) {
  // Title and listingType props are available but not displayed in the UI
  
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
                  reference={property.reference}
                  description={property.description}
                  propertyType={listingType === "rent" ? "To Let" : "For Sale"}
                  location={property.location}
                  locationString={property.locationString}
                  locationDetail={property.locationDetail}
                  site={property.site}
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
    </div>
  );
}
