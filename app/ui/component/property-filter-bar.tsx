"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PropertyFilterBar() {
  // "Buy" is active by default
  const [isBuyActive, setIsBuyActive] = useState(true);
  const [locationInput, setLocationInput] = useState("");
  const [locations, setLocations] = useState<string[]>([]);

  const handleAddLocation = () => {
    if (!locationInput.trim()) return;
    setLocations((prev) => [...prev, locationInput.trim()]);
    setLocationInput("");
  };

  const removeLocation = (loc: string) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-screen-lg mx-auto">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isBuyActive ? "Find Property for Sale" : "Find Property for Rent"}
      </h1>

      {/* Buy / Rent Toggle Buttons - centered */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setIsBuyActive(true)}
          className={`
            pb-2 border-b-2
            ${isBuyActive ? "border-[#D1DA68] text-[#D1DA68]" : "border-transparent text-gray-600"}
            hover:text-[#D1DA68] transition-colors
          `}
        >
          Buy
        </button>
        <button
          onClick={() => setIsBuyActive(false)}
          className={`
            pb-2 border-b-2
            ${!isBuyActive ? "border-[#D1DA68] text-[#D1DA68]" : "border-transparent text-gray-600"}
            hover:text-[#D1DA68] transition-colors
          `}
        >
          Rent
        </button>
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
            <button
              onClick={handleAddLocation}
              className="absolute right-1 top-1 bottom-1 bg-blue-500 text-white rounded-full px-3 text-sm hover:bg-blue-600"
            >
              +
            </button>
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
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full">
            Search
          </button>
        </div>
      </div>

      {/* Bottom Row: Additional Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mt-4">
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
        <button className="border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-full w-full">
          More Filters +
        </button>
      </div>
    </div>
  );
}
