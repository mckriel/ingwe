"use client";
import PropertyCard from "@/app/ui/component/property-card";

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
}

export default function PropertyListingGrid() {
  // Example data
  const mockData: Property[] = [
    {
      id: 1,
      image: "/house1.jpeg",
      title: "Standard Apartment",
      price: "R12,000 per month",
      beds: 4,
      baths: 3,
      sqft: 1780,
    },
    {
      id: 2,
      image: "/house1.jpeg",
      title: "Luxury Villa",
      price: "R25,000 per month",
      beds: 5,
      baths: 4,
      sqft: 2500,
    },
    {
        id: 3,
        image: "/house1.jpeg",
        title: "Luxury Villa",
        price: "R25,000 per month",
        beds: 5,
        baths: 4,
        sqft: 2500,
      },
      {
        id: 4,
        image: "/house1.jpeg",
        title: "Luxury Villa",
        price: "R25,000 per month",
        beds: 5,
        baths: 4,
        sqft: 2500,
      },
    // ... more listings
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Responsive Grid: 1 col on mobile, 2 on sm, 3 on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.map((property) => (
          <PropertyCard
            key={property.id}
            image={property.image}
            title={property.title}
            price={property.price}
            beds={property.beds}
            baths={property.baths}
            sqft={property.sqft}
          />
        ))}
      </div>
    </div>
  );
}
