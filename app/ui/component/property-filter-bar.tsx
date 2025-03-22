"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface propertyFilterBarProps {
  onSearch: () => void;
}

export default function PropertyFilterBar({ onSearch }: propertyFilterBarProps) {
  const [locationInput, setLocationInput] = useState("");
  const [locations, setLocations] = useState<string[]>([]);

  const pathname = usePathname();

  let heading_text = "Find Property for Sale";
  if (pathname === "/rent") heading_text = "Find Property for Rent";
  else if (pathname === "/buy") heading_text = "Find Property for Sale";

  const handleAddLocation = () => {
    if (!locationInput.trim()) return;
    setLocations((prev) => [...prev, locationInput.trim()]);
    setLocationInput("");
  };

  const removeLocation = (loc: string) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
  };

  return (
    <div className="bg-white p-4 rounded-lg w-full max-w-screen-lg mx-auto">
      {/* Heading determined by pathname */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        {heading_text}
      </h1>

      {/* Buy / Rent Toggle Buttons - centered */}
      <div className="flex justify-center gap-4 mb-4">
      </div>

      {/* Top Row: Location Search & Search Button */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        {/* Location Search & Selected Tags */}
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for location..."
              className="border border-gray-300 rounded-full px-4 py-2 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
            />
          </div>
          {locations.map((loc) => (
            <div
              key={loc}
              className="bg-blue-100 text-blue-700 flex items-center gap-2 px-3 py-1 rounded-full"
            >
              <span>{loc}</span>
              <button onClick={() => removeLocation(loc)}>
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {/* Search Button */}
        <div>
          <button className="bg-[#D1DA68] hover:bg-[#D1DA68] hover:text-gray-600 text-white px-6 py-2 rounded-full"
            onClick={onSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Bottom Row: Additional Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-4">
        <select className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
          <option>Property Type</option>
          <option>House</option>
          <option>Apartment</option>
          <option>Townhouse</option>
        </select>
        <select className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
          <option>Min Price</option>
          <option>R500,000</option>
          <option>R1,000,000</option>
          <option>R2,000,000</option>
        </select>
        <select className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
          <option>Max Price</option>
          <option>R1,000,000</option>
          <option>R2,000,000</option>
          <option>R3,000,000</option>
        </select>
        <select className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
          <option>Bedrooms</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </div>
    </div>
  );
}
