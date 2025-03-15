"use client";

import { useState } from "react";

/**
 * Example "SearchBar" or "SearchFilters" component
 */
export default function PropertyFilter() {
  // State for toggles
  const [isAspirational, setIsAspirational] = useState(false);
  const [isAffordable, setIsAffordable] = useState(false);

  return (
    <div className="bg-white w-full p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
      {/* Left side: Pill filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Location Input */}
        <div className="bg-[#A3D92D] text-black rounded-full px-4 py-2 flex items-center gap-2">
          {/* Optional icon, e.g. a search icon or location icon */}
          <svg
            className="w-4 h-4 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.125 17.875l.564-.564m0 0l1.313-1.313m-1.877 1.877L4.125 12m6 6l1.875-1.875m6.75-4.5a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Locations"
            className="bg-transparent placeholder-black/70 focus:outline-none"
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="bg-[#A3D92D] text-black rounded-full px-4 py-2 flex items-center gap-2">
          <span className="whitespace-nowrap">Property Type</span>
          <select className="bg-transparent focus:outline-none">
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            {/* Add more types */}
          </select>
        </div>

        {/* Price Dropdown */}
        <div className="bg-[#A3D92D] text-black rounded-full px-4 py-2 flex items-center gap-2">
          <span className="whitespace-nowrap">Price</span>
          <select className="bg-transparent focus:outline-none">
            <option value="any">Any</option>
            <option value="100000-300000">$100k - $300k</option>
            <option value="300000-600000">$300k - $600k</option>
            {/* etc. */}
          </select>
        </div>

        {/* Features Dropdown */}
        <div className="bg-[#A3D92D] text-black rounded-full px-4 py-2 flex items-center gap-2">
          <span className="whitespace-nowrap">Features</span>
          <select className="bg-transparent focus:outline-none">
            <option value="garden">Garden</option>
            <option value="pool">Pool</option>
            <option value="garage">Garage</option>
            {/* etc. */}
          </select>
        </div>
      </div>

      {/* Right side: Toggles */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Aspirational Toggle */}
        <ToggleSwitch
          label="Ingwe Aspirational"
          isOn={isAspirational}
          onToggle={() => setIsAspirational(!isAspirational)}
        />

        {/* Affordable Toggle */}
        <ToggleSwitch
          label="Ingwe Affordable"
          isOn={isAffordable}
          onToggle={() => setIsAffordable(!isAffordable)}
        />
      </div>
    </div>
  );
}

type ToggleSwitchProps = {
    label: string;
    isOn: boolean;
    onToggle: () => void;
  };
/**
 * A simple toggle switch component
 */
function ToggleSwitch({ label, isOn, onToggle }: ToggleSwitchProps) {
    return (
      <label className="flex items-center cursor-pointer select-none">
        <span className="mr-2">{label}</span>
        <div
          onClick={onToggle}
          className={`
            relative w-10 h-5 rounded-full
            transition-colors duration-300
            ${isOn ? "bg-green-500" : "bg-gray-300"}
          `}
        >
          <div
            className={`
              absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow-md
              transform transition-transform duration-300
              ${isOn ? "translate-x-5" : ""}
            `}
          />
        </div>
      </label>
    );
  }
