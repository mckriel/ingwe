"use client";

import { useState } from "react";
import PropertyFilterBar from "@/app/ui/component/property-filter-bar";
import PropertyListingGrid from "@/app/ui/component/property-listing-grid";

interface Property {
    id: number;
    image: string;
    title: string;
    price: string;
    beds: number;
    baths: number;
    size: number;
}

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);

  const mockData: Property[] = [
    {
      id: 1,
      image: "/house1.jpeg",
      title: "Standard Apartment",
      price: "R12,000 per month",
      beds: 4,
      baths: 3,
      size: 1780,
    },
    {
      id: 2,
      image: "/house1.jpeg",
      title: "Luxury Villa",
      price: "R25,000 per month",
      beds: 5,
      baths: 4,
      size: 2500,
    },
  ];

  const handleSearch = () => {
    setProperties(mockData);
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-8">
      <PropertyFilterBar onSearch={handleSearch} />
      <PropertyListingGrid properties={properties} />
    </main>
  );
}
