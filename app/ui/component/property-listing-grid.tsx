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
}

interface PropertyListingGridProps {
  properties: Property[];
}

export default function PropertyListingGrid({ properties }: PropertyListingGridProps) {
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* If no properties, show a message */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              image={property.image}
              title={property.title}
              price={property.price}
              beds={property.beds}
              baths={property.baths}
              sqft={property.size}
            />
          ))}
        </div>
    </div>
  );
}
